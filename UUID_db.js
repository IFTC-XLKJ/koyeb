const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const UUID_dbKEY = "LkduYVIN+ZVpT2OpSV2DM5gdurynzN8Mk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOgX1YRTD4bRxjkxKTd/6hMWRN0NetHfBJoKankFcCLU0Vf9bHQwR/X8o15DuJZVFC0="
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class UUID_db {
    constructor() { }
    async getData(uuid) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
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
    async addData(uuid, type, id, data) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
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
                    fields: `("${uuid}","${type}","${id}","${data})`,
                    page: 1,
                    limit: 1,
                }),
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
}
module.exports = UUID_db;