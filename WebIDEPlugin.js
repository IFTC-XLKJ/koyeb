const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const Key = "LkduYVIN+ZWosrZsXW8sba7Q7BBL0qSck08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOg+9kHWbbCgYXNAi7DX14Rg6dByzyzqTiaCUcmKMmV4SefvaZh7XVfJo15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class WebIDEPlugin {
    /**
     * 
     * @param {Number} page 
     * @returns 
     */
    static async get(page) {
        return await this.post({
            type: "SELECT",
            filter: ``,
            page: page,
            limit: 10,
        });
    }
    static async insert(data) {
        return await this.post({
            type: "INSERT",
            filter: `名称,版本号,版本名,ID,简介,资源链接`,
            fields: data,
        });
    }
    static async post(options) {
        const { type, filter, fields, page, limit, sort } = options;
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(type == "SELECT" ? getDataURL : setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": Key,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    type: type == "SELECT" ? void 0 : type,
                    filter,
                    fields,
                    page,
                    limit,
                    sort
                })
            });
            if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
            const json = await response.json();
            console.log(json);
            return json;
        } catch (e) {
            console.log("发送错误(WebIDEPlugin.post)：", e);
            throw e;
        }
    }
}

module.exports = WebIDEPlugin;