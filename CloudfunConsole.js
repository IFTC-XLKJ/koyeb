const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const ConsoleKey = "LkduYVIN+ZV9wMyAV9CO3a9h7A1kYvFOk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOi31cRK2y7Ag4Z8S1HVu+YVfc9eV+c+nKBGeuZzKOdkZYPHlIL1yiJto15DuJZVFC0="
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class CloudfunConsole {
    constructor() { }
    async getLogs(uuid) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": ConsoleKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    filter: `UUID="${uuid}"`,
                    page: 1,
                    limit: 1000,
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
    async setLogs(uuid, logs) {
        const fields = logs.map(log => `("${uuid}", "${log.type}", "${log.log}")`).join(", ");
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": ConsoleKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    type: "INSERT",
                    filter: `UUID,类型,内容`,
                    fields: fields,
                })
            })
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
}

module.exports = CloudfunConsole;