import Sign from "./Sign.ts";
import crypto from "crypto";
import type { GetByIDResponse, SearchResponse, UserLoginResponse } from "./types.ts";

const sign: Sign = new Sign();

const VVZHkey: string =
    "LkduYVIN+ZWY+y+kN565pfAF4JJRhfpNk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOjMsGiImi0mbmolRNbRck3er4BHin3lsS3b1WYXDgY826RZEvDia4yFo15DuJZVFC0=";
const getDataURL: string = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL: string = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType: string = "application/json";

function md5Hash(input: string): string {
    const hash: crypto.Hash = crypto.createHash("md5");
    hash.update(input);
    return hash.digest("hex");
}

export default class User {
    constructor() {}
    async getByID(id: number): Promise<GetByIDResponse> {
        return (await this.fetchData(getDataURL, {
            filter: `ID=${id}`,
            page: 1,
            limit: 1,
        })) as GetByIDResponse;
    }
    async search(keyword: string): Promise<SearchResponse> {
        return (await this.fetchData(getDataURL, {
            filter: `昵称 LIKE "%${keyword}%" OR 邮箱 LIKE "%${keyword}%" OR ID LIKE "%${keyword}%" OR 头衔 LIKE "%${keyword}%"`,
            page: 1,
            limit: 1000000000000,
        })) as SearchResponse;
    }
    async getAll(): Promise<SearchResponse> {
        return (await this.fetchData(getDataURL, {
            page: 1,
            limit: 1000000000000,
        })) as SearchResponse;
    }
    async login(user: string, password: string): Promise<UserLoginResponse> {
        return (await this.fetchData(getDataURL, {
            filter: `(ID="${user}" OR 昵称="${user}" OR 邮箱="${user}") AND 密码="${md5Hash(password)}"`,
            page: 1,
            limit: 1,
        })) as UserLoginResponse;
    }
    async fetchData(url: string, body: Object): Promise<Object> {
        const timestamp: number = Date.now();
        const signaturePromise: Promise<string> = sign.get(String(timestamp));
        try {
            const signature: string = await signaturePromise;
            const response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error: unknown) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    }
}
