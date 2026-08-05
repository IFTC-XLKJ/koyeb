import { sign } from "./shared.ts";

const UUID_dbKEY: string =
    "LkduYVIN+ZVpT2OpSV2DM5gdurynzN8Mk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOgX1YRTD4bRxjkxKTd/6hMWRN0NetHfBJoKankFcCLU0Vf9bHQwR/X8o15DuJZVFC0=";
const getDataURL: string = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL: string = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType: string = "application/json";

export interface UUIDData {
    UUID: string;
    类型: string;
    ID: number;
    数据: string;
    createdAt: number;
    updatedAt: number;
}

export interface UUIDResponse {
    code: number;
    msg: string;
    logid: string;
    createdAt: number;
    count: number;
    fields: UUIDData[];
    sql: string;
}

export default class UUID_db {
    constructor() {}

    static sendEmail(email: string, title: string, content: string): Promise<any> {
        let t = Math.round(new Date().getTime() / 1000);
        var raw = JSON.stringify({
            key: "f7115d5ac87aedd4d42cf510ed064449",
            main: btoa(encodeURIComponent(content)),
            to: email,
            title: title,
            t: t,
            sw: "a3d7eb36c26735f3f6250ff1283158b78753be06936a928d40a5c0d3c2401cc9",
        });
        const requestOptions: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: raw,
            redirect: "follow",
        };
        return new Promise((resolve, reject) => {
            fetch("https://api.pgaot.com/email/send", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    resolve(result);
                })
                .catch((error) => {
                    throw new Error("error:", error);
                });
        });
    }

    async getData(uuid: string): Promise<UUIDResponse> {
        const timestamp: number = Date.now();
        const signature: string = sign.get(String(timestamp));
        try {
            const response: Response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": UUID_dbKEY,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    filter: `UUID="${uuid}"`,
                    page: 1,
                    limit: 1,
                }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    }

    async addData(uuid: string, type: string, id: number, data: string): Promise<UUIDResponse> {
        const timestamp: number = Date.now();
        const signature: string = sign.get(String(timestamp));
        try {
            const response: Response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": UUID_dbKEY,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    type: "INSERT",
                    filter: `UUID,类型,ID,数据`,
                    fields: `("${uuid}","${type}","${id}","${data}")`,
                    page: 1,
                    limit: 1,
                }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    }

    async deleteData(uuid: string): Promise<UUIDResponse> {
        const timestamp: number = Date.now();
        const signature: string = sign.get(String(timestamp));
        try {
            const response: Response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": UUID_dbKEY,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    type: "DELETE",
                    filter: `UUID="${uuid}"`,
                }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    }
}