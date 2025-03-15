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
                    filter: `应用包名='${packageName}' AND 版本号>${versionCode}`,
                    page: 1,
                    limit: 1,
                })
            });
            const json = await response.json();
            console.log(json);
            if (json.code === 200 && json.data.length > 0) {
                return json.data[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
}

module.exports = AppUpdateCheck;