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
            console.log(json);
            return json;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
    async publish(ID, username, avatar, content, title, titleColor) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVDiscussionKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    type: "INSERT",
                    filter: "ID,昵称,头像,内容,头衔,头衔色,论坛ID",
                    fields: `(${ID},"${username}","${avatar}",'${encodeURIComponent(content)}',"${title}","${titleColor}","${genDiscussionID()}")`,
                })
            });
            if (!response.ok) {
                const text = await response.text();
                console.log(text)
                throw new Error('Network response was not ok ' + response.statusText);
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

function time() {
    return Date.now();
}

function genDiscussionID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = Discussion;