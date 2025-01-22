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
    async addBook(name, id, author, description, cover) {
        const bookID = generateBookID();
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVBooksKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    type: "INSERT",
                    filter: "ID,作者,书ID,书名,封面,介绍",
                    fields: `(${id},"${author}","${bookID}","${name}","${cover}","${description}")`,
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
    async addChapter(id, bookid, num, name, content) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVChaptersKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    type: "INSERT",
                    filter: "ID,书ID,章节编号,章节名,章节内容",
                    fields: `(${id},"${bookid}","${num}","${name}","${content}")`
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
    async updateBook(type, id, data) {
        let filter = `书ID="${id}"`;
        let fields = ``;
        if (type == "name") {
            fields = `书名="${data}"`;
        } else if (type == "author") {
            fields = `作者="${data}"`;
        } else if (type == "description") {
            fields = `介绍="${data}"`;
        } else if (type == "cover") {
            fields = `封面="${data}"`;
        } else {
            return {
                code: 400,
                msg: "type参数值错误"
            }
        }
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVBooksKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    type: "UPDATE",
                    fields: fields,
                    filter: filter,
                    page: 1,
                    limit: 1,
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

function generateBookID() {
    const timestamp = Date.now();
    const id = (timestamp * Math.random()).toString().slice(0, 10).replace('.', '');
    return id.padEnd(10, '0');
}

function time() {
    return Date.now();
}

module.exports = Books;