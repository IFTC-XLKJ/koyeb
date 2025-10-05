const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const Key = "LkduYVIN+ZWosrZsXW8sba7Q7BBL0qSck08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOg+9kHWbbCgYXNAi7DX14Rg6dByzyzqTiaCUcmKMmV4SefvaZh7XVfJo15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class WebIDEPlugin {
    static async get(page) {

    }
    async post(type) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
        } catch (e) {

        }
    }
}

module.exports = WebIDEPlugin;