const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const VVDiscussionKey = "LkduYVIN+ZW+aXatg3bnYupOvfl2DlTOk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOjMsGiImi0mbsxAI7TJNkqiqEaLlJXoSc0IahckjU0GMxUf3ahzRxkmo15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class Discussion {
    async get(page) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVDiscussionKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    filter: ``,
                    page: 1,
                    limit: 10000000000,
                    sort: "updatedAt desc",
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const json = await response.json();
            const num = end - start;
            console.log(json);
            return json;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
}

function time() {
    return Date.now();
}

module.exports = Discussion;