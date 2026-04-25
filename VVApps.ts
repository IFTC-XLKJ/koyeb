import crypto from "crypto";
import Sign from "./Sign.ts";

const sign: Sign = new Sign();

const VVAppsAppkey: string =
    "LkduYVIN+ZUWzF7FSj+NsNqrGBGJmkFdk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOgX1YRTD4bRxkEhaZ0+evEwQSqYnA7z5aHmCrd0o8F4OZU8p3gJla+jo15DuJZVFC0=";
const getDataURL: string = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL: string = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType: string = "application/json";

export default class VVApps {
    async fetchData(url: string, body: Object): Promise<Object> {
        const timestamp: number = Date.now();
        const signaturePromise: Promise<string> = sign.get(String(timestamp));
        try {
            const signature: string = await signaturePromise;
            const response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVAppsAppkey,
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
