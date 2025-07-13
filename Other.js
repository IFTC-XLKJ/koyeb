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
const { console } = require("inspector");

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
        this.app.get("/api/cloudfun/get", async (req, res) => {
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
            const { uuid } = req.params;
            const cloudfunLogs = [];
            const filepath = `cloudfunlogs/${uuid}.json`;
            try {
                const json = await uuid_db.getData(uuid);
                if (json.code !== 200) {
                    res.status(json.code).json({
                        code: json.code,
                        msg: json.msg,
                        timestamp: time(),
                    });
                    return;
                }
                const data = json.fields[0];
                if (!data) {
                    res.status(404).json({
                        code: 404,
                        msg: "未知的云函数",
                        timestamp: time(),
                    });
                    return;
                }
                if (data.类型 !== "cloudfun") {
                    res.status(400).json({
                        code: 400,
                        msg: "不是云函数",
                        timestamp: time(),
                    });
                    return;
                }
                const src = data.数据;
                const response = await fetch(src);
                const code = await response.text();
                await ensureFile(filepath);
                let fun;
                try {
                    fun = eval(`globalThis.require = null;
                                var require = async function(src) {
                                    const response = await fetch(src);
                                    const code = await response.text();
                                    return eval(code);
                                };\n${code}`);
                } catch (e) {
                    res.status(500).json({
                        code: 500,
                        msg: "云函数代码解析错误",
                        error: e.message,
                        timestamp: time(),
                    });
                    return;
                }

                const request = {
                    response: class {
                        #status = 200;
                        #headers = {};
                        #content = null;
                        constructor(content, options = {}) {
                            if (typeof options !== "object") options = {};
                            this.#status = options.status || 200;
                            this.#headers = options.headers || {};
                            this.#content = content || null;
                        }
                        send() {
                            for (const key in this.#headers) {
                                res.set(key, this.#headers[key]);
                            }
                            res.set({ "X-COPYRIGHTS": "IFTC" });
                            res.status(this.#status).send(this.#content);
                        }
                        json() {
                            res.set({ "X-COPYRIGHTS": "IFTC" });
                            res.json(this.#content);
                        }
                        html() {
                            res.set({ "X-COPYRIGHTS": "IFTC" });
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
                            });
                            res.status(this.#status).send(this.#content);
                        }
                        image() {
                            res.set({
                                "Content-Type": "image/png",
                                "X-COPYRIGHTS": "IFTC"
                            });
                            res.status(this.#status).send(this.#content);
                        }
                        audio() {
                            res.set({
                                "Content-Type": "audio/mpeg",
                                "X-COPYRIGHTS": "IFTC"
                            });
                            res.status(this.#status).send(this.#content);
                        }
                        video() {
                            res.set({
                                "Content-Type": "video/mp4",
                                "X-COPYRIGHTS": "IFTC"
                            });
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
                                const hash = require("crypto").createHash("sha256");
                                hash.update(String(text));
                                return hash.digest("hex");
                            }
                            async #post(url, type, filter, fields, page, limit, sort, tableid) {
                                const timestamp = Date.now();
                                const signature = this.#sign(timestamp);
                                try {
                                    const response = await fetch(url, {
                                        method: "POST",
                                        headers: {
                                            "X-Pgaot-Key": this.#key,
                                            "X-Pgaot-Sign": signature,
                                            "X-Pgaot-Time": timestamp.toString(),
                                            "Content-Type": this.#contentType,
                                        },
                                        body: JSON.stringify({
                                            type, filter, fields, page, limit,
                                        }),
                                    });
                                    if (!response.ok) {
                                        throw new Error("Network response was not ok " + response.statusText);
                                    }
                                    return await response.json();
                                } catch (error) {
                                    console.error("There was a problem with the fetch operation:", error);
                                    throw error;
                                }
                            }
                            async get(options = {}) {
                                return await this.#post(this.#getDataURL, undefined, options.filter || "", options.fields || "", options.page || 1, options.limit || 1, options.sort, undefined);
                            }
                            async insert(options = {}) {
                                return await this.#post(this.#setDataURL, "INSERT", options.filter || "", options.fields || "", undefined, undefined, undefined, undefined);
                            }
                            async update(options = {}) {
                                return await this.#post(this.#setDataURL, "UPDATE", options.filter || "", options.fields || "", undefined, undefined, undefined, undefined);
                            }
                            async delete(options = {}) {
                                return await this.#post(this.#setDataURL, "DELETE", options.filter || "", undefined, undefined, undefined, undefined, undefined);
                            }
                            async getMulitiple(options = {}) {
                                if (!options.tableid) throw new Error("tableid is required");
                                return await this.#post(this.#getDataURL, "GET", options.filter || "", undefined, undefined, undefined, undefined, options.tableid);
                            }
                        },
                        DOMParser: class {
                            parseFromString(str, contentType) {
                                return new JSDOM(str, { contentType }).window.document;
                            }
                        },
                        console: {
                            log: async (...args) => {
                                console.log.apply(console, args);
                                const log = args.map(arg => formatLog(arg, request)).join(" ");
                                cloudfunLogs.push({ type: "log", msg: log });
                                await writeLogs({
                                    type: "log",
                                    msg: log,
                                    timestamp: time(),
                                });
                            },
                            warn: () => { },
                            error: () => { },
                            info: () => { }
                        }
                    },
                };

                if (typeof fun === "function" && fun.constructor.name === "AsyncFunction") {
                    await fun(request);
                } else if (typeof fun === "function") {
                    fun(request);
                }
            } catch (e) {
                console.error(e);
                res.status(500).send(`出现了错误：${e}`);
            }
            async function ensureFile(filepath) {
                try {
                    await fs.stat(filepath);
                } catch {
                    await fs.writeFile(filepath, JSON.stringify([]));
                }
            }

            async function writeLogs(log) {
                try {
                    await ensureFile(filepath);
                    const content = await fs.readFile(filepath, "utf8");
                    const oldCloudfunLogs = JSON.parse(content);
                    const newCloudfunLogs = [...oldCloudfunLogs, log];
                    await fs.writeFile(filepath, JSON.stringify(newCloudfunLogs));
                } catch (e) {
                    console.error("日志写入失败", e);
                }
            }

            function formatNativeCode(code, request) {
                const nativeMap = [
                    [request.response, "response"],
                    [request.tools.pgdbs, "pgdbs"],
                    [request.tools.DOMParser, "DomParser"],
                    [request.tools.console.log, "console.log"],
                    [request.tools.console.warn, "console.warn"],
                    [request.tools.console.error, "console.error"],
                    [request.tools.console.info, "console.info"]
                ];
                for (const [fn, name] of nativeMap) {
                    if (code === fn?.toLocaleString()) return `function ${name}() { [native code] }`;
                }
                return code;
            }

            function formatNativeObject(obj, request) {
                if (obj && (obj.log || obj.error || obj.warn || obj.info)) {
                    return { object: "console { [native code] }" };
                }
                return obj;
            }

            function formatLog(log, request) {
                if (typeof log === "object") {
                    return JSON.stringify(formatNativeObject(log, request));
                }
                if (typeof log === "string") {
                    return log;
                }
                if (typeof log === "function") {
                    return formatNativeCode(log.toLocaleString(), request);
                }
                if (typeof log === "number" || typeof log === "boolean" || typeof log === "bigint") {
                    return log.toLocaleString();
                }
                if (typeof log === "symbol") {
                    return log.toString();
                }
                return String(log);
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
        });
        this.app.get("/api/123pan/share/:shareid", async (req, res) => {
            requestLog(req);
            const { shareid } = req.params;
            const { pwd } = req.query;
            if (!shareid) {
                res.status(400).json({
                    code: 400,
                    msg: "缺少参数shareid",
                    timestamp: time(),
                });
                return;
            }
            const api = `https://api.kxzjoker.cn/api/123pan?key=${shareid}&pwd=${pwd || ""}`;
            const response = await fetch(api);
            if (!response.ok) {
                res.status(500).json({
                    code: 500,
                    msg: response.statusText,
                    timestamp: time(),
                });
                return;
            }
            const data = await response.json();
            console.log("API请求成功", data);
            res.json({
                code: 200,
                msg: "请求成功",
                data: data.data || [],
                timestamp: time(),
            });
        });
        this.app.get("/src_proxy", async (req, res) => {
            requestLog(req);
            const { url } = req.query;
            console.log("请求的url", url);
            try {
                const response = await fetch(url);
                const contentType = response.headers.get("content-type");
                const blob = await response.blob();
                const contentLength = blob.size;
                res.setHeader("Content-Type", contentType);
                res.setHeader("Content-Length", contentLength);
                res.send(blob);
            } catch (e) {
                res.status(500).send(e.message);
            }
        });
        this.app.get("/safejump", async (req, res) => {
            requestLog(req);
            const { page } = req.query;
            if (!page) {
                res.send(null);
                return;
            }
            try {
                const url = new URL(formatUrl(page));
                const domain = url.hostname;
                if (checkIntranetIP()) {
                    res.send(`<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>内网IP</title>
</head>
<body>
    <center>
        <h1>内网IP</h1>
        <p><b>${domain}</b> 是内网IP，无法确定此URL的安全性</p>
    </center>
</body>

</html>`);
                    return;
                }
                const icpcheckapi = "https://www.weiserver.top/api/icp";
                const r = await fetch(`${icpcheckapi}?domain=${domain}`);
                const j = await r.json();
                if (j.code == 200) {
                    res.redirect(formatUrl(page));
                } else {
                    if (await checkWhitelist()) {
                        res.redirect(formatUrl(page));
                    } else {
                        res.set({
                            "Content-Type": "text/html"
                        });
                        res.send(`<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>阻止访问</title>
    <style>
        a {
            text-decoration: none;
            color: lightskyblue;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <center>
        <h1>阻止访问</h1>
        <p><b>${domain}</b> 为备案或不在官方白名单中，如需加入白名单，请联系 <a href="https://qm.qq.com/q/tpZthU6N5m">QQ 3164417130</a> 或向 <a href="mailto:iftcceo@139.com">iftcceo@139.com</a> 发送邮件</p>
    </center>
</body>

</html>`);
                    }
                }
                let retryCount = 0;
                async function checkWhitelist() {
                    const whitelistFilename = "whitelist.json";
                    try {
                        const whitelist = await fs.readFile(whitelistFilename, { encoding: "utf-8" });
                        const whitelistJson = JSON.parse(whitelist);
                        let has = false;
                        for (var i = 0; i < whitelistJson.length; i++) {
                            const item = whitelistJson[i];
                            if (domain == item) {
                                has = true;
                                break;
                            }
                        }
                        return has;
                    } catch (e) {
                        if (retryCount < 5) {
                            retryCount++;
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            return await checkWhitelist();
                        } else {
                            console.error("Failed to read whitelist.json after 5 retries.");
                            return false;
                        }
                    }
                }
                function formatUrl(url) {
                    url = url.trim();
                    url = decodeURIComponent(url);
                    if (url.startsWith("https://") || url.startsWith("http://")) return url;
                    return `http://${url}`;
                }
                function checkIntranetIP() {
                    const intranetDomains = [
                        "localhost",
                        "127.0.0.1",
                        "0.0.0.0",
                        "::1"
                    ];
                    if (intranetDomains.includes(domain)) return true;
                    const ipv4Pattern = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/;
                    if (ipv4Pattern.test(domain)) return true;
                    if (domain.startsWith("fe80:") || domain.startsWith("fc00:") || domain.startsWith("fd00:")) return true;
                    return false;
                }
            } catch (e) {
                console.error(e);
                res.send(`服务端发生错误`);
            }
        });
        this.app.get("/api/authorization", async (req, res) => {
            requestLog(req);
            if (req.headers.authorization.split(" ")[0] != "Bearer") {
                res.status(400).json({
                    code: 400,
                    msg: "Authorization格式错误",
                    timestamp: time(),
                });
            }
            const token = req.headers.authorization.split(" ")[1];
            console.log("toekn:", token);
            try {
                const json = await user.loginByToken(token);
                if (json.code == 200) {
                    const data = json.fields[0];
                    if (!data) {
                        res.status(401).json({
                            code: 401,
                            msg: "token错误",
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
                res.status(500).json({
                    code: 500,
                    msg: "服务器发生错误",
                    error: e.message,
                    timestamp: time()
                })
            }
        });
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