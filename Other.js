const path = require("path");
const fs = require("fs").promises;
const UUID_db = require("./UUID_db.js");
const fetch = require("node-fetch");
const {
    JSDOM
} = require("jsdom");
const User = require("./User.js");
const CloudfunConsole = require("./CloudfunConsole.js");
const weather = require("weather-js");
const axios = require('axios');


const user = new User();
const uuid_db = new UUID_db();
const cloudfunConsole = new CloudfunConsole();
const NodeGeocoder = require('node-geocoder');
const expressWs = require('express-ws');

class Other {
    constructor(app, requestLog) {
        this.app = app;
        expressWs(app);
        this.app.get("/api/geocoder", async (req, res) => {
            requestLog(req);
            try {
                const options = {
                    provider: 'here',
                    formatter: null
                };
                const geocoder = NodeGeocoder(options);
                geocoder.reverse({
                    lat: req.query.lat,
                    lon: req.query.lon
                });
                res.json({
                    code: 200,
                    msg: "请求成功",
                    data: geocoder,
                    timestamp: time(),
                });
            } catch (error) {
                res.status(500).json({
                    code: 500,
                    msg: "服务器内部错误",
                    error: error.message,
                    timestamp: time(),
                });
            }
        })
        this.app.get("/api/ipplace", async (req, res) => {
            let {
                ip
            } = req.query;
            if (!ip) {
                ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
                if (ip.includes(",")) {
                    ip = ip.split(",")[0].trim();
                }
            }
            console.log(ip);
            if (checkIPType(ip) == "Invalid IP") {
                res.json({
                    code: 400,
                    msg: "IP无效",
                    timestamp: time(),
                })
                return;
            }
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            if (!response.ok) {
                res.status(500).json({
                    code: 500,
                    msg: "服务器内部错误",
                    error: response.statusText,
                    timestamp: time(),
                });
                return;
            }
            const data = await response.json();
            res.json({
                code: 200,
                msg: "请求成功",
                data: data,
                timestamp: time(),
            });
            function checkIPType(ip) {
                const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
                if (ipv4Pattern.test(ip)) {
                    const segments = ip.split(".");
                    if (segments.every(segment => parseInt(segment, 10) >= 0 && parseInt(segment, 10) <= 255)) {
                        return "IPv4";
                    }
                }
                const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
                if (ipv6Pattern.test(ip)) {
                    return "IPv6";
                }
                return "Invalid IP";
            }
        });
        this.app.get("/file/blockly/workspace-search",
            async (req, res) => {
                const content = await this.getFile("node_modules/@blockly/plugin-workspace-search/dist/index.js");
                if (content) {
                    res.set({
                        "Content-Type": "text/javascript",
                    });
                    res.send(content);
                } else {
                    res.status(500).send(null);
                }
            });
        this.app.get("/file/blockly/shadow-block-converter",
            async (req, res) => {
                const content = await this.getFile("node_modules/@blockly/shadow-block-converter/dist/index.js");
                if (content) {
                    res.set({
                        "Content-Type": "text/javascript",
                    });
                    res.send(content);
                } else {
                    res.status(500).send(null);
                }
            });
        this.app.get("/api/weather",
            async (req, res) => {
                requestLog(req);
                const {
                    city
                } = req.query;
                if (!city) {
                    res.status(400).json({
                        code: 400,
                        msg: "缺少参数",
                        timestamp: time(),
                    });
                    return;
                }
                weather.find({
                    search: city, degreeType: "C"
                }, function (err, result) {
                    if (err) {
                        res.status(500).json({
                            code: 500,
                            msg: "服务器内部错误",
                            error: err.message,
                            timestamp: time(),
                        });
                        return;
                    }
                    res.json({
                        code: 200,
                        msg: "获取成功",
                        data: result,
                        timestamp: time(),
                    });
                });
            });
        this.app.get("/api/cloudfun/new", async (req,
            res) => {
            requestLog(req);
            const {
                ID, password, file
            } = req.query;
            if (!(ID && ID == 0) || !password || !file) {
                res.status(400).json({
                    code: 400,
                    msg: "缺少参数",
                    timestamp: time(),
                });
                return;
            }
            try {
                const userData = await user.login(ID, password);
                if (userData.code != 200) {
                    res.status(userData.code).json({
                        code: userData.code,
                        msg: userData.msg,
                        timestamp: time(),
                    });
                    return;
                }
                const data = userData.fields[0];
                if (!data) {
                    res.status(401).json({
                        code: 401,
                        msg: "账号或密码错误",
                        timestamp: time(),
                    });
                    return;
                }
                const uuid = generateUUID();
                const json = await uuid_db.addData(uuid, "cloudfun", ID, file);
                if (json.code == 200) {
                    res.status(200).json({
                        code: 200,
                        msg: "创建成功",
                        uuid: uuid,
                        url: `/api/cloudfun/${uuid}`,
                        timestamp: time(),
                    });
                } else {
                    res.status(json.code).json({
                        code: json.code,
                        msg: json.msg,
                        timestamp: time(),
                    });
                }
            } catch (e) {
                console.error(e);
                res.status(500).send(null);
            }
        });
        this.app.get("/api/cloudfun/get",
            async (req, res) => {
                requestLog(req);
                const {
                    ID
                } = req.query;
                if (!(ID && ID == 0)) {
                    res.status(400).json({
                        code: 400,
                        msg: "缺少参数",
                        timestamp: time(),
                    });
                    return;
                }
                try {
                    const json = await uuid_db.getByID(ID);
                    if (json.code == 200) {
                        const data = [];
                        json.fields.forEach(field => {
                            if (field.类型 != "cloudfun") return;
                            data.push({
                                ID: field.ID,
                                UUID: String(field.UUID),
                                file: String(field.数据),
                                createdAt: field.createdAt,
                                updatedAt: field.updatedAt
                            });
                        });
                        res.json({
                            code: 200,
                            msg: "获取成功",
                            data: data,
                            timestamp: time(),
                        });
                    } else {
                        res.status(json.code).json({
                            code: json.code,
                            msg: json.msg,
                            timestamp: time(),
                        });
                    }
                } catch (e) {
                    console.error(e);
                    res.status(500).json({
                        code: 500,
                        msg: "服务器内部错误",
                        error: e.message,
                        timestamp: time(),
                    });
                }
            });
        this.app.get("/api/cloudfun/update",
            async (req, res) => {
                requestLog(req);
                const {
                    ID,
                    password,
                    UUID,
                    file
                } = req.query;
                if (!(ID && ID == 0) || !password || !UUID || !file) {
                    res.status(400).json({
                        code: 400,
                        msg: "缺少参数",
                        timestamp: time(),
                    });
                    return;
                }
                try {
                    const userData = await user.login(ID, password);
                    if (userData.code == 200) {
                        const data = json.fields[0];
                        if (!data) {
                            res.status(404).json({
                                code: 401,
                                msg: "账号或密码错误",
                                timestamp: time(),
                            });
                            return;
                        }
                        const json = await uuid_db.update(ID, UUID, file);
                    } else {
                        res.status(userData.code).json({
                            code: userData.code,
                            msg: userData.msg,
                            timestamp: time(),
                        })
                    }
                } catch (e) {
                    res.status(500).json({
                        code: 500,
                        msg: "服务内部错误",
                        error: e.message,
                        timestamp: time(),
                    });
                }
            });
        this.app.all("/api/cloudfun/:uuid", async (req, res) => {
            const {
                uuid
            } = req.params;
            const cloudfunLogs = [];
            try {
                const json = await uuid_db.getData(uuid);
                if (json.code == 200) {
                    const data = json.fields[0];
                    if (!data) {
                        res.status(404).json({
                            code: 404,
                            msg: "未知的云函数",
                            timestamp: time(),
                        });
                        return;
                    }
                    if (data.类型 == "cloudfun") {
                        const ID = data.ID;
                        const src = data.数据;
                        const response = await fetch(src);
                        const code = await response.text();
                        const filepath = "cloudfunlogs/" + uuid + ".json";
                        try {
                            const stats = await fs.stat(filepath);
                            console.log("文件存在")
                        } catch (e) {
                            console.log("文件不存在，初始化文件")
                            await fs.writeFile(filepath, JSON.stringify([]));
                        }
                        const fun = eval(`globalThis.require = null;
                                var require = async function(src) {
                                const response = await fetch(src);
                                const code = await response.text();
                                return eval(code);
                                };\n${code}`);
                        console.log(fun, typeof fun);
                        const that = this;
                        let WebSocket = null;
                        this.app.ws("/api/cloudfun/ws/" + uuid, function (ws, req) {
                            WebSocket = ws;
                            ws.onopen = () => {
                                console.log("WebSocket连接已打开", ws);
                            }
                        })
                        const request = {
                            response: class {
                                #status = 200;
                                #headers = {};
                                #content = null;
                                constructor(content, options) {
                                    if (!options) options = {};
                                    if (typeof options != "object") options = {};
                                    this.#status = options.status || 200;
                                    this.#headers = options.headers || {};
                                    this.#content = content || null;
                                }
                                send() {
                                    for (const key in this.#headers) {
                                        res.set(key, this.#headers[key]);
                                    }
                                    res.set({
                                        "X-COPYRIGHTS": "IFTC"
                                    })
                                    res.status(this.#status).send(this.#content);
                                }
                                json() {
                                    res.set({
                                        "X-COPYRIGHTS": "IFTC"
                                    })
                                    res.json(this.#content);
                                }
                                html() {
                                    res.set({
                                        "X-COPYRIGHTS": "IFTC"
                                    })
                                    res.status(this.#status).send(this.#content);
                                }
                                css() {
                                    res.set({
                                        "Content-Type": "text/css;charset=utf-8",
                                        "X-COPYRIGHTS": "IFTC"
                                    });
                                    res.status(this.#status).send(this.#content);
                                }
                                js() {
                                    res.set({
                                        "Content-Type": "text/javascript;charset=utf-8",
                                        "X-COPYRIGHTS": "IFTC"
                                    });
                                    res.status(this.#status).send(this.#content);
                                }
                                text() {
                                    res.set({
                                        "Content-Type": "text/plain;charset=utf-8",
                                        "X-COPYRIGHTS": "IFTC"
                                    })
                                    res.status(this.#status).send(this.#content);
                                }
                                image() {
                                    res.set({
                                        "Content-Type": "image/png",
                                        "X-COPYRIGHTS": "IFTC"
                                    })
                                    res.status(this.#status).send(this.#content);
                                }
                                audio() {
                                    res.set({
                                        "Content-Type": "audio/mpeg",
                                        "X-COPYRIGHTS": "IFTC"
                                    })
                                    res.status(this.#status).send(this.#content);
                                }
                                video() {
                                    res.set({
                                        "Content-Type": "video/mp4",
                                        "X-COPYRIGHTS": "IFTC"
                                    })
                                    res.status(this.#status).send(this.#content);
                                }
                            },
                            method: req.method,
                            query: req.query,
                            body: req.body,
                            headers: req.headers,
                            UUID: uuid,
                            tools: {
                                pgdbs: class {
                                    #key;
                                    #contentType = "application/json";
                                    #getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
                                    #setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
                                    constructor(key) {
                                        if (!key) throw new Error("key is required");
                                        this.#key = key;
                                    }
                                    #sign(text) {
                                        const hash = crypto.createHash("sha256");
                                        hash.update(text);
                                        const sha256sum = hash.digest("hex");
                                        return sha256sum
                                    }
                                    async #post(url, type, filter, fields, page, limit, sort, tableid) {
                                        const timestamp = Date.now();
                                        const signaturePromise = this.#sign(timestamp);
                                        try {
                                            const signature = await signaturePromise;
                                            const response = await fetch(url, {
                                                method: "POST",
                                                headers: {
                                                    "X-Pgaot-Key": this.#key,
                                                    "X-Pgaot-Sign": signature,
                                                    "X-Pgaot-Time": timestamp.toString(),
                                                    "Content-Type": this.#contentType,
                                                },
                                                body: JSON.stringify({
                                                    type: type,
                                                    filter: filter,
                                                    fields: fields,
                                                    page: page,
                                                    limit: limit,
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
                                    async get(options) {
                                        if (!options) options = {};
                                        return await this.#post(this.#getDataURL, void 0, options.filter || "", options.fields || "", options.page || 1, options.limit || 1, options.sort, void 0);
                                    }
                                    async insert(options) {
                                        if (!options) options = {};
                                        return await this.#post(this.#setDataURL, "INSERT", options.filter || "", options.fields || "", void 0, void 0, void 0, void 0);
                                    }
                                    async update(options) {
                                        if (!options) options = {};
                                        return await this.#post(this.#setDataURL, "UPDATE", options.filter || "", options.fields || "", void 0, void 0, void 0, void 0);
                                    }
                                    async delete(options) {
                                        if (!options) options = {};
                                        return await this.#post(this.#setDataURL, "DELETE", options.filter || "", void 0, void 0, void 0, void 0, void 0);
                                    }
                                    async getMulitiple(options) {
                                        if (!options) options = {};
                                        if (!options.tableid) throw new Error("tableid is required");
                                        return await this.#post(this.#getDataURL, "GET", options.filter || "", void 0, void 0, void 0, void 0, options.tableid);
                                    }
                                },
                                DOMParser: class {
                                    parseFromString(str, contentType) {
                                        return new JSDOM(str, {
                                            contentType: contentType
                                        }).window.document;
                                    }
                                },
                                console: {
                                    log: async function (...args) {
                                        const log = args.join(" ");
                                        cloudfunLogs.push({
                                            type: "log",
                                            msg: formatLog(log, request),
                                        });
                                        await writeLogs({
                                            type: "log",
                                            msg: formatLog(log, request),
                                            timestamp: time(),
                                        });
                                        console.log(log);
                                    },
                                    warn: function (...args) { },
                                    error: function (...args) { },
                                    info: function (...args) { }
                                }
                            },
                        };
                        if (fun[Symbol.toStringTag] == "AsyncFunction") {
                            await fun(request);
                            return;
                        }
                        fun(request);
                        console.log(cloudfunLogs)
                    } else {
                        res.status(400).json({
                            code: 400,
                            msg: "不是云函数",
                            timestamp: time(),
                        });
                        return;
                    }
                } else {
                    res.status(json.code).json({
                        code: json.code,
                        msg: json.msg,
                        timestamp: time(),
                    });
                }
            } catch (e) {
                console.error(e);
                res.status(500).send(`出现了错误：${e}`);
            }
            async function writeLogs(log) {
                try {
                    const filepath = "cloudfunlogs/" + uuid + ".json";
                    try {
                        const stats = await fs.stat(filepath);
                        console.log("文件存在")
                    } catch (e) {
                        console.log("文件不存在，初始化文件")
                        await fs.writeFile(filepath, JSON.stringify([]));
                    }
                    console.log("读取文件")
                    const content = await fs.readFile(filepath, "utf8");
                    console.log("解析JSON")
                    const oldCloudfunLogs = JSON.parse(content);
                    console.log("合并日志")
                    const newCloudfunLogs = [...oldCloudfunLogs, log];
                    console.log("写入日志")
                    await fs.writeFile(filepath, JSON.stringify(newCloudfunLogs));
                } catch (e) { }
            }
            function formatNativeCode(code, request) {
                let end = false;
                function check(obj) {
                    const keys = Object.keys(obj);
                    for (const key of keys) {
                        if (typeof obj[key] === "function") {
                            const funcode = obj[key].toLocaleString();
                            if (code == funcode) {
                                end = true;
                                return `function ${key}() { [native code] }`;
                            }
                        } else if (typeof obj[key] === "object" && obj[key] !== null) {
                            return check(obj[key]);
                        }
                    }
                    return code;
                }
                return check(request);
            }
            function formatLog(log, request) {
                if (typeof log == "object") {
                    return JSON.stringify(log);
                }
                if (typeof log == "string") {
                    return log;
                }
                if (typeof log == "function") {
                    return formatNativeCode(log.toLocaleString(), request);
                }
                if (typeof log == "number") {
                    return log.toLocaleString();
                }
                if (typeof log == "boolean") {
                    return log.toLocaleString();
                }
                if (typeof log == "bigint") {
                    return log.toLocaleString();
                }
                if (typeof log == "symbol") {
                    return log.toString()
                }
            }
        });
        this.app.get("/api/cloudfunlogs", async (req, res) => {
            const { uuid } = req.query;
            const filepath = "cloudfunlogs/" + uuid + ".json";
            try {
                const content = await fs.readFile(filepath, "utf8");
                res.json({
                    code: 200,
                    msg: "请求成功",
                    logs: JSON.parse(content),
                    timestamp: time(),
                });
            } catch (e) {
                console.log(e);
                res.json({
                    code: 500,
                    msg: "服务器错误",
                    logs: [],
                    timestamp: time(),
                });
            }
        })
        this.app.get("/api/translate", async (req, res) => {
            const {
                text,
                from,
                to
            } = req.query;
            try {
                const response = await translateWithLibre(text, from, to);
                res.json({
                    code: 200,
                    msg: "翻译成功",
                    data: response,
                    timestamp: time(),
                });
            } catch (e) {
                res.status(500).json({
                    code: 500,
                    msg: "服务内部错误",
                    timestamp: time(),
                });
            }
        });
        this.app.get("/googleapis-fonts/css2", async (req, res) => {
            requestLog(req);
            const { family } = req.query;
            try {
                const response = await fetch("https://fonts.googleapis.com/css2?family=" + family);
                const css = await response.text();
                res.set({
                    "Content-Type": "text/css"
                })
                res.send(css);
            } catch (e) { }
        })
        console.log("Other");
    }
    async getFile(path) {
        try {
            const content = await fs.readFile(path,
                "utf-8");
            return content;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}

function time() {
    return Date.now();
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    return uuid;
}

async function translateWithLibre(text, sourceLang = 'auto', targetLang = 'zh') {
    try {
        const response = await axios.post('https://libretranslate.de/translate',
            {
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text'
            });
        return response.data.translatedText;
    } catch (error) {
        console.error('Translation error:',
            error.response?.data || error.message);
    }
}

module.exports = Other;