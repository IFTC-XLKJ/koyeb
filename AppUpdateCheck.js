const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const AppUpdateCheckKey = "LkduYVIN+ZW/V/puUuQEBEqhh3LVki4Qk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOhBTieBGXcSepwb0ynurC2w53Fc18bCkKKvUrN8cRqwvPNMvOUZWyu4o15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class AppUpdateCheck {
    constructor() { }
    /**
     * 检查更新
     * @param {String} packageName 
     * @param {Number} versionCode 
     */
    async check(packageName, versionCode) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": AppUpdateCheckKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    filter: `应用包名="${packageName}"`,
                    page: 1,
                    limit: 1,
                })
            });
            const json = await response.json();
            console.log(json);
            if (json.code == 200) {
                const data = json.fields[0];
                if (data) {
                    if (data.版本号 > versionCode) {
                        return {
                            code: 200,
                            msg: "有新版本",
                            update: true,
                            downloadURL: data.更新链接,
                            versionCode: data.版本号,
                            versionName: data.版本名,
                            description: data.更新内容,
                        };
                    } else if (data.版本号 == 0) {
                        return {
                            code: 200,
                            msg: "test版本更新",
                            update: false,
                            downloadURL: data.更新链接,
                            versionCode: data.版本号,
                            versionName: data.版本名,
                            description: data.更新内容,
                        };
                    } else {
                        return {
                            code: 200,
                            msg: "无更新",
                            update: false,
                        };
                    }
                } else {
                    return {
                        code: 404,
                        msg: "找不到更新",
                        update: false,
                    };
                }
            } else {
                return {
                    code: 400,
                    msg: "查询失败",
                    update: false,
                };
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
}

function time() {
    return Date.now();
}

module.exports = AppUpdateCheck;