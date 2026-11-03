import { PGDB } from "./PGDB.ts";
import type { PGDBRow, PGDBResult } from "./PGDB.ts";
import mime from "mime";

const dbid = "49efdbd6564dd6ee576df700856cdab7";

export interface CloudStorageItem extends PGDBRow {
    path: string;
    type: string;
    lastModified: number;
    size: number;
    chunks: string;
}

const NEEDS_ESCAPE = /[^\x20-\x7E]|[%&]/u;

export function encodeEmoji(value: string) {
    const out = value.replace(/[\uD800-\uDFFF]|./gsu, (char) => {
        return NEEDS_ESCAPE.test(char) ? `&#${char.codePointAt(0)};` : char;
    });
    return out.replace(/[0-9a-fA-F]{32,}/g, (m) =>
        m.replace(/./gu, (c) => `&#${c.codePointAt(0)};`)
    );
}

export function decodeEmoji(value: string): string {
    return value.replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)));
}

const quote = (value?: string | null,) => `'${encodeEmoji(value || "").replace(/'/g, "''")}'`;

export class CloudStorage {
    static async stat(path: string) {
        const r = await PGDB.run(`SELECT * FROM ${dbid} WHERE path = ${quote(path)}`);
        if (r.code != 200) return new Error(r.code + " " + r.msg);
        return r.fields[0] as CloudStorageItem;
    }
    static async exists(path: string) {
        const r = await PGDB.run(`SELECT 1 FROM ${dbid} WHERE path = ${quote(path)}`);
        if (r.code != 200) return new Error(r.code + " " + r.msg);
        return r.fields.length > 0;
    }
    static async upload(filename: string, size: number) {
        const r = await PGDB.run(`INSERT INTO ${dbid} (path, type, lastModified, size, chunks) VALUES ('${quote(filename)}', 'file', ${Date.now() / 1000}, ${size}, '')`);
        if (r.code != 200) return new Error(r.code + " " + r.msg);
        return true;
    }
    static async uploadChunk(filepath: string, chunk: File | Buffer): Promise<boolean | Error> {
        const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
        const isBuffer = chunk instanceof Buffer;
        if (isBuffer && chunk.length > MAX_CHUNK_SIZE) return new Error("Chunk size exceeds 5MB limit");
        
        const mimeType = mime.lookup(filepath) || "application/octet-stream";
        const filename = filepath.split("/").pop() ?? "chunk";
        const r = isBuffer 
            ? await uploadChunkAsBuffer(chunk as Buffer, filename)
            : await uploadChunk(chunk as File);
        
        if (r.code != 200) return new Error(r.code + " " + r.msg);
        const stat = await CloudStorage.stat(filepath);
        if (stat instanceof Error) return stat;
        if (isBuffer && !stat) return new Error("File not found, call createFile first");
        
        const chunks = stat.chunks ? JSON.parse(stat.chunks) : [];
        if (!r.url) return new Error("上传切片成功但未返回 URL: " + JSON.stringify(r));
        chunks.push(r.url);
        
        let size = 0;
        for (const cid of chunks) {
            const head = await fetch(cid, { method: "HEAD" });
            if (head.ok) {
                const cl = head.headers.get("content-length");
                if (cl) size += parseInt(cl, 10);
            }
        }
        
        const update = await PGDB.run(`UPDATE ${dbid} SET chunks = ${quote(JSON.stringify(chunks))}, size = ${size}, lastModified = ${Date.now() / 1000} WHERE path = ${quote(filepath)}`);
        if (update.code != 200) return new Error(update.code + " " + update.msg);
        return true;
    }
    static async mkdir(dirname: string) {
        const stat = await CloudStorage.stat(dirname);
        if (stat instanceof Error) return stat;
        if (stat) return new Error("Directory or File already exists");
        const r = await PGDB.run(`INSERT INTO ${dbid} (path, type, lastModified, createdAt, updatedAt) VALUES (${quote(dirname)}, 'dir', ${Date.now() / 1000}, ${parseInt(String(Date.now() / 1000))}, ${parseInt(String(Date.now() / 1000))})`);
        if (r.code != 200) return new Error(r.code + " " + r.msg);
        return true;
    }
    static async delete(path: string) {
        const stat = await CloudStorage.stat(path);
        if (stat instanceof Error) return stat;
        if (!stat) return new Error("Path not found");
        if (stat.type === "file") {
            const r = await PGDB.run(`DELETE FROM ${dbid} WHERE path = ${quote(path)}`);
            if (r.code != 200) return new Error(r.code + " " + r.msg);
            return true;
        }
        // Directory: delete all entries under this path
        const prefix = encodeEmoji((path.endsWith("/") ? path : path + "/")).replaceAll("'", "''");
        const r = await PGDB.run(`DELETE FROM ${dbid} WHERE path = ${quote(path)} OR path LIKE '${prefix}%'`);
        if (r.code != 200) return new Error(r.code + " " + r.msg);
        return true;
    }
    static async size(path: string): Promise<number | Error> {
        const stat = await CloudStorage.stat(path);
        if (stat instanceof Error) return stat;
        if (!stat) return new Error("Path not found");
        if (stat.type === "file") {
            return stat.size;
        }
        // Directory: recursively sum all file sizes under this directory
        const items = await CloudStorage.list(path);
        if (items instanceof Error) return items;
        let totalSize = 0;
        for (const item of items) {
            if (item.type === "file") {
                totalSize += item.size || 0;
            } else if (item.type === "dir") {
                const subSize = await CloudStorage.size(item.path);
                if (subSize instanceof Error) return subSize;
                totalSize += subSize;
            }
        }
        return totalSize;
    }
    static async createFile(filepath: string): Promise<boolean | Error> {
        const stat = await CloudStorage.stat(filepath);
        if (stat instanceof Error) return stat;
        if (stat) return new Error("File already exists");
        const r = await PGDB.run(`INSERT INTO ${dbid} (path, type, lastModified, createdAt, updatedAt) VALUES (${quote(filepath)}, 'file', ${Date.now() / 1000}, ${parseInt(String(Date.now() / 1000))}, ${parseInt(String(Date.now() / 1000))})`);
        if (r.code != 200) return new Error(r.code + " " + r.msg);
        return true;
    }

    static async list(dirname: string) {
        if (dirname != "/") {
            const stat = await CloudStorage.stat(dirname);
            if (stat instanceof Error) return stat;
            if (!stat) return new Error("Directory or File not found");
            if (stat.type !== "dir") return new Error("Not a directory");
        }
        const prefix = encodeEmoji(dirname.endsWith("/") ? dirname : dirname + "/").replaceAll("'", "''");
        const r = await PGDB.run(`SELECT * FROM ${dbid} WHERE path LIKE '${prefix}%' AND path NOT LIKE '${prefix}%/%' ORDER BY path ASC`);
        if (r.code != 200) return new Error(r.code + " " + r.msg);
        return r.fields as CloudStorageItem[];
    }
}

async function uploadChunk(file: File) {
    const mimeType = mime.lookup(file.name) || "application/octet-stream";
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("path", "iftc");
    formdata.append("type", mimeType);
    const requestOptions = {
        method: "POST",
        headers: {
            "X-Powered-By": "IFTC"
        },
        body: formdata
    };
    const r = await fetch("https://api.pgaot.com/user/up_cat_file", requestOptions);
    const j = await r.json();
    console.log(j);
    return j;
}

async function uploadChunkAsBuffer(buffer: Buffer, filename: string = "chunk"): Promise<{ code: number; url: string; size: number }> {
    const mimeType = mime.lookup(filename) || "application/octet-stream";
    const formdata = new FormData();
    formdata.append("file", new Blob([buffer], { type: mimeType }), filename);
    formdata.append("path", "iftc");
    formdata.append("type", mimeType);
    const requestOptions = {
        method: "POST",
        headers: {
            "X-Powered-By": "IFTC"
        },
        body: formdata
    };
    const r = await fetch("https://api.pgaot.com/user/up_cat_file", requestOptions);
    const j = await r.json();
    return j as { code: number; url: string; size: number };
}