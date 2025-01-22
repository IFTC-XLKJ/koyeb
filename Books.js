const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const VVBooksKey = "LkduYVIN+ZXEbj7I08kftBnkN25M8c/Lk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOjde4PvOKPIgi4zSawQ3bPn9Q881jaCLyWeXITCxSdPFrNdG9sIVZTuo15DuJZVFC0=";
const VVChaptersKey = "LkduYVIN+ZU7HRQmxLWhqnKzMchYy67Wk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOiH89YaJEeMQLX8zy7eaUFC++TXSbBeR/IVOztIj8bZzSLmnuMRvy5Po15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class Books {
    constructor() { }

    async search(keyword) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVBooksKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    filter: `ID="${keyword}" OR 书ID LIKE "%${keyword}%" OR 作者 LIKE "%${keyword}%" OR 书名 LIKE "%${keyword}%" OR 介绍 LIKE "%${keyword}%"`,
                    page: 1,
                    limit: 1000000000000,
                    sort: "RAND()",
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
    async getChapters(bookID) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVChaptersKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    filter: `书ID="${bookID}"`,
                    page: 1,
                    limit: 1000000000000,
                })
            })
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
}

function time() {
    return Date.now();
}

module.exports = Books;