const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const UUID_dbKEY = "LkduYVIN+ZVpT2OpSV2DM5gdurynzN8Mk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOgX1YRTD4bRxjkxKTd/6hMWRN0NetHfBJoKankFcCLU0Vf9bHQwR/X8o15DuJZVFC0="
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class UUID_db {
    constructor() { }
    /**
     * 获取数据
     * @param {String} uuid 
     * @returns {Promise}
     */
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
    /**
     * 添加数据
     * @param {String} uuid 
     * @param {String} type 
     * @param {String} id 
     * @param {String} data 
     * @returns {Promise}
     */
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
                    fields: `("${uuid}","${type}","${id}","${data}")`,
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
    /**
     * 发送邮件
     * @param {String} email 
     * @param {String} title 
     * @param {String} content 
     * @returns {Promise}
     */
    sendEmail(email, title, content) {
        let t = Math.round(new Date().getTime() / 1000);
        var raw = JSON.stringify({
            key: "f7115d5ac87aedd4d42cf510ed064449",
            main: btoa(encodeURIComponent(content)),
            to: email,
            title: title,
            t: t,
            sw: "a3d7eb36c26735f3f6250ff1283158b78753be06936a928d40a5c0d3c2401cc9"
        });
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: raw,
            redirect: 'follow'
        };
        return new Promise((resolve, reject) => {
            fetch("https://api.pgaot.com/email/send", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    resolve(result)
                })
                .catch(error => {
                    throw new Error("error:", error);
                });
        });
    }
    async deleteData(uuid) {
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
                    type: "DELETE",
                    filter: `UUID="${uuid}"`,
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
    async getByID(ID) {
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
                    filter: `ID=${ID}`,
                    page: 1,
                    limit: 1000000000000,
                    sort: "updatedAt desc"
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    }
    async update(ID, UUID, data) {
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
                    type: "UPDATE",
                    filter: `ID=${id} AND UUID="${UUID}"`,
                    fields: `数据="${data}"`,
                })
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