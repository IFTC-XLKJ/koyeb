import Sign from "./Sign.ts";
import crypto from "crypto";

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

interface GetByIDResponse {
    code: number;
    data?: any; // 根据实际业务调整 data 的结构
    message?: string;
}

export default class User {
    constructor() {}
    async getByID(id: number): Promise<GetByIDResponse> {
        return await this.fetchData(getDataURL, {
            filter: `ID=${id}`,
            page: 1,
            limit: 1,
        }) as GetByIDResponse;
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
