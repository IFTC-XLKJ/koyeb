import { BackendKey } from "./BackendKey.ts";

const api = "https://api.pgaot.com/dbs/v2/sql";

export interface PGDBRow {
    createdAt: number;
    updatedAt: number;
    [key: string]: string | number | null;
}

export interface PGDBResult {
    code: number;
    msg: string;
    logid: string;
    createdAt: number;
    count: number;
    fields: PGDBRow[];
}

export class PGDB {
    static async run(sql: string) {
        const r = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Pgaot-Key": BackendKey
            },
            body: JSON.stringify({ sql })
        });
        const j = await r.json();
        console.log("PGDB.run", sql, j);
        return j as PGDBResult;
    }
}
