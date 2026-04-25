import Sign from "./Sign.ts";
import type { PGDBSResponse, AppUpdateCheckResponse, AppUpdateCheckResult } from "./types.ts";

const sign: Sign = new Sign();

const AppUpdateCheckKey: string =
    "LkduYVIN+ZW/V/puUuQEBEqhh3LVki4Qk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOhBTieBGXcSepwb0ynurC2w53Fc18bCkKKvUrN8cRqwvPNMvOUZWyu4o15DuJZVFC0=";
const getDataURL: string = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL: string = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType: string = "application/json";

export default class AppUpdateCheck {
    async check(packageName: string, versionCode: number): Promise<AppUpdateCheckResult> {
        const body: Object = {
            filter: `应用包名="${packageName}"`,
            page: 1,
            limit: 1,
        };
        const json: AppUpdateCheckResponse = await this.fetchData(getDataURL, body);
        if (json.code != 200)
            return {
                code: 400,
                msg: "查询失败",
                update: false,
            };
        else {
            const data = json.fields[0];
            if (!data)
                return {
                    code: 400,
                    msg: "未找到应用",
                    update: false,
                };
            if (data.版本号 > versionCode)
                return {
                    code: 200,
                    msg: "有新版本",
                    update: true,
                    downloadURL: data.更新链接,
                    versionCode: data.版本号,
                    versionName: data.版本名,
                    description: data.更新内容,
                };
            else if (data.版本号 == 0)
                return {
                    code: 200,
                    msg: "test版本更新",
                    update: false,
                    downloadURL: data.更新链接,
                    versionCode: data.版本号,
                    versionName: data.版本名,
                    description: data.更新内容,
                };
            else
                return {
                    code: 200,
                    msg: "无更新",
                    update: false,
                };
        }
    }
    async fetchData(url: string, body: Object): Promise<AppUpdateCheckResponse> {
        const timestamp: number = Date.now();
        const signaturePromise: Promise<string> = sign.get(String(timestamp));
        try {
            const signature: string = await signaturePromise;
            const response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": AppUpdateCheckKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
            const json: AppUpdateCheckResponse = await response.json();
            console.log(json);
            return json;
        } catch (error: unknown) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    }
}
