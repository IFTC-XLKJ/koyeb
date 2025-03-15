const crypto = require("crypto");
const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const VVZHkey =
    "LkduYVIN+ZWY+y+kN565pfAF4JJRhfpNk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOjMsGiImi0mbmolRNbRck3er4BHin3lsS3b1WYXDgY826RZEvDia4yFo15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";
// 用户-数据表
class User {
    constructor() { }
    // 通过ID获取数据
    async getByID(id) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;

            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    filter: `ID=${id}`,
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
    // 获取所有数据
    async getAll() {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);

        try {
            const signature = await signaturePromise;

            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    filter: "",
                    page: 1,
                    limit: 10000000000000000,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }

            const json = await response.json();
            return json;
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    }
    // 登录
    async login(user, password) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);

        try {
            const signature = await signaturePromise;

            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    filter: `(ID="${user}" OR 昵称="${user}" OR 邮箱="${user}") AND 密码="${md5Hash(password)}"`,
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
    // 注册
    async register(email, password, nickname, avatar) {
        const all = await this.getAll();
        if (all.code != 200) {
            throw new Error(all.msg);
        }
        const count = all.fields[0].ID + 1;
        if (all.fields.filter((item) => item.邮箱 == email).length > 0) {
            return {
                code: 400,
                msg: "邮箱已被注册"
            };
        }
        if (all.fields.filter((item) => item.昵称 == nickname).length > 0) {
            return {
                code: 400,
                msg: "昵称已被注册"
            };
        }
        var raw = JSON.stringify({
            type: "INSERT",
            filter: `ID,昵称,头像,邮箱,密码,V币,头衔,头衔色`,
            fields: `("${count}","${nickname}","${avatar}","${email}","${md5Hash(password)}",0,"用户","#1BC514FF")`,
        });
        var requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Pgaot-Key": VVZHkey,
                "X-Pgaot-Time": Date.now().toString(),
                "X-Pgaot-Sign": await sign.get(Date.now()),
            },
            body: raw,
            redirect: "follow",
        };
        return new Promise((resolve, reject) => {
            fetch("https://api.pgaot.com/dbs/cloud/set_table_data", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    resolve({ ...result, id: count });
                })
                .catch((error) => {
                    resolve({ msg: error.message });
                });
        });
    }
    // 发送验证码
    sendCode(email, title, content) {
        let t = Math.round(new Date().getTime() / 1000);
        var raw = JSON.stringify({
            key: "f7115d5ac87aedd4d42cf510ed064449",
            main: btoa(encodeURIComponent(content)),
            to: email,
            count: 6,
            expired: 120,
            title: title,
            t: t,
        });
        var requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: raw,
            redirect: "follow",
        };
        return new Promise((resolve, reject) => {
            fetch("https://api.pgaot.com/email/customize_sand", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    resolve(result);
                })
                .catch((error) => {
                    throw new Error("error:", error);
                });
        });
    }
    verifyCode(email, code) {
        let t = Math.round(new Date().getTime() / 1000);
        var raw = JSON.stringify({
            key: "f7115d5ac87aedd4d42cf510ed064449",
            identity: email,
            code: code,
            t: t,
        });
        var requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: raw,
            redirect: "follow",
        };
        return new Promise((resolve, reject) => {
            fetch("https://api.pgaot.com/email/customize", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    resolve(result);
                })
                .catch((error) => {
                    throw new Error("error:", error);
                });
        });
    }
    async update(type, id, password, data) {
        let filter = `ID="${id}" AND 密码="${md5Hash(password)}"`;
        let fields = "";
        if (type == "nickname") {
            fields = `昵称="${data}"`;
        } else if (type == "avatar") {
            fields = `头像="${data}"`;
        } else if (type == "email") {
            fields = `邮箱="${data}"`;
        } else if (type == "password") {
            fields = `密码=${md5Hash(data)}`;
        } else {
            return {
                code: 400,
                type: "type参数值错误",
            };
        }
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);

        try {
            const signature = await signaturePromise;

            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    type: "UPDATE",
                    fields: fields,
                    filter: filter,
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
    async resetPassword(id, password) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    type: "UPDATE",
                    filter: `ID=${id}`,
                    page: 1,
                    limit: 1,
                    fields: `密码="${md5Hash(password)}"`
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

    async search(keyword) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    filter: `昵称 LIKE "%${keyword}%" OR 邮箱 LIKE "%${keyword}%" OR ID LIKE "%${keyword}%" OR 头衔 LIKE "%${keyword}%"`,
                    page: 1,
                    limit: 1000000000000,
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
    async loginByToken(token) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    filter: `token="${token}"`,
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
    async updateToken(id, password) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(setDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    type: "UPDATE",
                    filter: `ID=${id} AND 密码="${md5Hash(password)}"`,
                    page: 1,
                    limit: 1,
                    fields: `token="${generateToken()}"`
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
    /**
     * 管理员登录
     * @param {Number} id 
     * @param {String} password 
     * @returns {Promise}
     */
    async getToken(id, password) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    filter: `ID=${id} AND 密码="${md5Hash(password)}"`,
                    page: 1,
                    limit: 1,
                    fields: `token`
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
    /**
     * 管理员登录
     * @param {Number} id 
     * @param {String} password 
     * @returns {Promise}
     */
    async opLogin(id, password) {
        const timestamp = Date.now();
        const signaturePromise = sign.get(timestamp);
        try {
            const signature = await signaturePromise;
            const response = await fetch(getDataURL, {
                method: "POST",
                headers: {
                    "X-Pgaot-Key": VVZHkey,
                    "X-Pgaot-Sign": signature,
                    "X-Pgaot-Time": timestamp.toString(),
                    "Content-Type": contentType,
                },
                body: JSON.stringify({
                    filter: `ID=${id} AND 密码="${md5Hash(password)}" AND 管理员=1`,
                    page: 1,
                    limit: 1,
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

/**
 * MD5加密
 * @param {String} input 
 * @returns {String}
 */

function md5Hash(input) {
    const hash = crypto.createHash("md5");
    hash.update(input);
    return hash.digest("hex");
}
/**
 * 生成token
 * @returns {String}
 */

function generateToken() {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16);
    const token = `${timestamp}-${randomBytes.toString("hex")}`;
    return token;
}

module.exports = User;