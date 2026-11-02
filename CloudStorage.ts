import { PGDB } from "./PGDB.ts";
import type { PGDBRow, PGDBResult } from "./PGDB.ts";

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

const quote = (value?: string | null) => `'${encodeEmoji(value || "").replace(/'/g, "''")}'`;

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
    static async upload(filename: string) {
        const r = await PGDB.run(`INSERT INTO ${dbid} (path, type, lastModified, size, chunks) VALUES ('${quote(filename)}', 'file', ${Date.now() / 1000}, 0, '')`);
        if (r.code != 200) return new Error(r.code + " " + r.msg);
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
    static async delete() {}
    static async list(dirname: string) {
        const r = await PGDB.run(`SELECT * FROM ${dbid} WHERE path LIKE ${quote(dirname + "/%")}`);
        if (r.code != 200) return new Error(r.code + " " + r.msg);
        return r.fields as CloudStorageItem[];
    }
}

async function uploadChunk(file: File) {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("path", "iftc");
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