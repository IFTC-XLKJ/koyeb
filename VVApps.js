const crypto = require("crypto");
const Sign = require("./Sign.js");
const sign = new Sign();

const VVAppsAppkey = "LkduYVIN+ZUWzF7FSj+NsNqrGBGJmkFdk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOgX1YRTD4bRxkEhaZ0+evEwQSqYnA7z5aHmCrd0o8F4OZU8p3gJla+jo15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

module.exports = class {
    static async randomApps(platform) {
        const j = await this.postData({
            url: getDataURL,
            key: VVAppsAppkey,
            body: {
                filter: `平台="${platform}"`,
                page: 1,
                limit: 10,
                sort: "RANDOM()",
            }
        });
        return j;
    }
    static async postData(options = {}) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(options.url, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": options.key,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify(options.body),
            })
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
};