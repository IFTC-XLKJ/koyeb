const Sign = require("./Sign.js");
const User = require("./User.js");
const sign = new Sign();

const NOOBWorkKey = "LkduYVIN+ZUTA2pX6P23IcX+TZ/pbiiMk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOjtpix5Xz10DuRd2uyWwJKst8iKDzWqQWSRSQcB1kDw0lDy+GZKmxv0o15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class NOOB {
    constructor() { }
    async getWorks(id, password) {
        try {
            const USER = new User();
            const user = await USER.login(id, password);
            if (user.code == 200) {
                if (user.fields[0]) {
                    const timestamp = time();
                    const signaturePromise = sign.get(timestamp);
                    const signature = await signaturePromise;
                    const response = await fetch(getDataURL, {
                        method: "POST",
                        headers: {
                            "X-Pgaot-Key": NOOBWorkKey,
                            "X-Pgaot-Sign": signature,
                            "X-Pgaot-Time": timestamp.toString(),
                            "Content-Type": contentType
                        },
                        body: JSON.stringify({
                            filter: `ID=${id}`,
                            page: 1,
                            limit: 1000000000000,
                            sort: "updatedAt desc",
                        })
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    const json = await response.json();
                    console.log(json);
                    return json;
                } else {
                    return { code: 401, msg: "账号或密码错误", timestamp: time() };
                }
            } else {
                console.log(user);
                return { code: user.code, msg: user.msg, timestamp: time() };
            }
        } catch (error) {
            console.error('Error:', error);
            return { code: 500, msg: "服务内部错误", error: error.message, timestamp: time() }
        }
    }
    async getAll() {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": NOOBWorkKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    filter: ``,
                    page: 1,
                    limit: 1000000
                })
            })
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const json = await response.json();
            console.log(json);
            return json;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    async newWork(id, file) {
        const all = await this.getAll();
        const nid = all.fields[0].作品ID + 1;
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Pgaot-Key": NOOBWorkKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                },
                body: JSON.stringify({
                    type: "INSERT",
                    filter: `ID,作品ID,作品数据`,
                    fields: `(${id}, ${nid}, "${file}")`
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to insert data.");
            }
            const json = await response.json();
            console.log(json);
            return { json: json, nid: nid };
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    async getByNID(nid) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": NOOBWorkKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    filter: `作品ID=${nid}`,
                })
            })
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const json = await response.json();
            console.log(json);
            return json;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    async update(id, nid, file) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": NOOBWorkKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    type: "UPDATE",
                    filter: `ID=${id} AND 作品ID=${nid}`,
                    fields: `作品数据="${file}"`
                })
            })
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const json = await response.json();
            console.log(json);
            return json;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    async publish(id, nid) {
        const timestamp = time();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": NOOBWorkKey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType
                },
                body: JSON.stringify({
                    type: "UPDATE",
                    filter: `ID=${id} AND 作品ID=${nid}`,
                    fields: `发布=1`,
                })
            })
            const json = await response.json();
            console.log(json);
            return json;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = NOOB;

function time() {
    return Date.now()
}