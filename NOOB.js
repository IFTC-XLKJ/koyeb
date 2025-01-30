const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const User = require("./User.js");
const e = require("express");
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
            const user = USER.login(id, password);
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
}

module.exports = NOOB;

function time() {
    return Date.now()
}