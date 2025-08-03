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
        this.app.get("/file/blockly/blockly-plugin-workspace-multiselect",
            async (req, res) => {
                const content = await this.getFile("node_modules/@mit-app-inventor/blockly-plugin-workspace-multiselect/dist/index.js");
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
        this.app.get("/api/cloudfun/update", async (req, res) => {
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
                    const data = userData.fields[0];
                    if (!data) {
                        res.status(404).json({
                            code: 401,
                            msg: "账号或密码错误",
                            timestamp: time(),
                        });
                        return;
                    }
                    const json = await uuid_db.update(ID, UUID, file);
                    if (json.code == 200) {
                        res.status(200).json({
                            code: 200,
                            msg: "更新成功",
                            timestamp: time(),
                        });
                    } else {
                        res.status(json.code).json({
                            code: json.code,
                            msg: json.msg,
                            timestamp: time(),
                        })
                    }
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
        this.app.get("/api/cloudfun/delete", async (req, res) => {
            requestLog(req);
            const {
                ID,
                password,
                UUID
            } = req.query;
            if (!(ID && ID == 0) || !password || !UUID) {
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
                    const data = userData.fields[0];
                    if (!data) {
                        res.status(404).json({
                            code: 401,
                            msg: "账号或密码错误",
                            timestamp: time(),
                        });
                        return;
                    }
                    const json = await uuid_db.deleteData(UUID);
                    if (json.code == 200) {
                        res.status(200).json({
                            code: 200,
                            msg: "删除成功",
                            timestamp: time(),
                        });
                    } else {
                        res.status(json.code).json({
                            code: json.code,
                            msg: json.msg,
                            timestamp: time(),
                        })
                    }
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
                    fun = eval(`globalThis.require = null;\nvar require = null;\n${code}`);
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
                    require: async (file) => {
                        const content = await fetch(file);
                        return eval(`${content}`);
                    },
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
                const icpcheckapi = "https://api.yyy001.com/api/icp";
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
                    const UUID = generateUUID();
                    const json2 = await uuid_db.addData(UUID, "oauth", data.ID, "");
                    if (json2.code == 200) {
                        res.json({
                            code: 200,
                            msg: "等待用户授权",
                            url: `https://iftc.koyeb.app/authorization/${UUID}`,
                            uuid: UUID,
                        })
                    } else {
                        res.status(json2.code).json({
                            code: json2.code,
                            msg: json2.msg,
                            timestamp: time(),
                        });
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
        // this.app.get("/api/authorization/:uuid", async (req, res) => {
        //     requestLog(req);
        //     const { uuid } = req.params;
        //     try {
        //         const json = await uuid_db.getData(uuid);
        //         if (json.code == 200) {
        //             const data = json.fields[0];
        //             if (!data) {
        //                 res.status(404).json({
        //                     code: 404,
        //                     msg: "uuid不存在",
        //                     timestamp: time(),
        //                 });
        //                 return;
        //             }
        //             if (data.类型 != "oauth") {
        //                 res.status(404).json({
        //                     code: 404,
        //                     msg: "类型错误",
        //                     timestamp: time(),
        //                 });
        //                 return;
        //             }
        //             const json2 = await uuid_db.update(data.ID, data.UUID, )
        //             // res.status(200).json({
        //             //     code: 200,
        //             //     msg: "成功",
        //             //     data: data,
        //             //     timestamp: time(),
        //             // });
        //         } else {
        //             res.status(json.code).json({
        //                 code: json.code,
        //                 msg: json.msg,
        //                 timestamp: time(),
        //             });
        //         }
        //     } catch (e) {
        //         res.status(500).json({
        //             code: 500,
        //             msg: "服务器发生错误",
        //             error: e.message,
        //             timestamp: time()
        //         })
        //     }
        // });
        this.app.post("/api/aitranslate", async (req, res) => {
            requestLog(req);
            const {
                text,
                from,
                to
            } = req.body;
            if (!text || !from || !to) {
                res.status(400).json({
                    code: 400,
                    msg: "Invalid parameters",
                    timestamp: time()
                });
            }
            const languages = [
                "中文",
                "简体中文",
                "台湾繁体中文",
                "香港繁体中文",
                "繁体中文",
                "英文",
                "日语",
                "韩语",
                "法语",
                "西班牙语",
                "泰语",
                "阿拉伯语",
                "俄语",
                "葡萄牙语",
                "德语",
                "意大利语",
                "希腊语",
                "荷兰语",
                "波兰语",
                "保加利亚语",
                "罗马尼亚语",
                "丹麦语",
                "瑞典语",
                "芬兰语",
                "捷克语",
                "匈牙利语",
                "斯洛文尼亚语",
                "爱沙尼亚语",
                "挪威语"
            ];
            if (!languages.includes(from) || !languages.includes(to)) {
                return res.status(400).json({ error: "Invalid language", languages: languages });
            }
            try {
                const r = await fetch("https://free.amethyst.ltd/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer sk-AmethystFree`,
                        "Content-Type": "application/json",
                        Origin: "https://iftc.koyeb.app",
                    },
                    body: JSON.stringify({
                        model: "gemini-2.5-pro",
                        provider: "azureml",
                        temperature: 1,
                        top_p: 1,
                        messages: [{
                            role: "system",
                            content: `你的任务是将${from}翻译成${to}，输出格式为JSON的数组，格式为["翻译结果1", "翻译结果2", ...]`,
                        }, {
                            role: "user",
                            content: text,
                        }],
                        frequency_penalty: 0,
                        presence_penalty: 0,
                    })
                })
                const j = await r.json();
                console.log(j);
                if (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) {
                    console.log(j.choices[0].message);
                    let result = JSON.parse(j.choices[0].message.content.replace("```json", "").replace("```", ""));
                    const data = [];
                    result.forEach(item => {
                        data.push(item.trim());
                    });
                    res.json({
                        code: 200,
                        msg: "翻译成功",
                        data: data,
                    });
                } else {
                    res.status(500).json({
                        code: 500,
                        msg: "API响应格式错误",
                        error: j,
                        timestamp: time()
                    });
                }
            } catch (e) {
                res.json({
                    code: 500,
                    msg: "服务器发生错误",
                    error: e.message,
                    timestamp: time()
                })
            }
        })
        this.app.get("/api/aiworddefinition", async (req, res) => {
            requestLog(req);
            const {
                word
            } = req.query;
            if (!word) {
                res.status(400).json({
                    code: 400,
                    msg: "Invalid parameters",
                    timestamp: time()
                });
            }
            if (decodeURIComponent(word).includes(" ")) {
                res.status(400).json({
                    code: 400,
                    msg: "Invalid parameters",
                    timestamp: time()
                });
            }
            try {
                const r = await fetch("https://free.amethyst.ltd/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer sk-AmethystFree`,
                        "Content-Type": "application/json",
                        Origin: "https://iftc.koyeb.app",
                    },
                    body: JSON.stringify({
                        model: "gemini-2.5-pro",
                        provider: "azureml",
                        temperature: 0.5,
                        top_p: 1,
                        messages: [{
                            role: "system",
                            content: `你的任务是解释单词释义。解释要求：
获取单词的基本定义；
提供多语言翻译；
给出例句、用法、词性等详细信息；
结合 AI 生成更丰富的解释，比如结合上下文、使用场景等；
输出格式为标准的JSON，包含以下字段：
"definition": "单词基本定义（用中文回答）",
"translation": "单词中文翻译",
"examples": [多个例句，每个例子包含 "sentence"（英文原文） 和 "translation"（中文翻译） 字段],
"usage": "单词用法（用中文回答）",
"partOfSpeech": "单词词性",
"additionalInfo": "其他信息（用中文回答）"
`,
                        }, {
                            role: "user",
                            content: decodeURIComponent(word),
                        }],
                        frequency_penalty: 0,
                        presence_penalty: 0,
                    })
                })
                const data = await r.json();
                console.log(data);
                if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                    const result = data.choices[0].message.content.replace("```json", "").replace("```", "");
                    console.log(result)
                    res.status(200).json({
                        code: 200,
                        msg: "请求成功",
                        data: JSON.parse(result),
                        timestamp: time(),
                    });
                } else {
                    res.status(500).json({
                        code: 500,
                        msg: "请求失败",
                        error: data,
                        timestamp: time(),
                    });
                }
            } catch (e) {
                res.status(500).json({
                    code: 500,
                    msg: "Internal Server Error",
                    error: e.message,
                    timestamp: time()
                });
            }
        })
        this.app.post("/api/aisimilarity", async (req, res) => {
            requestLog(req);
            const {
                text1,
                text2
            } = req.body;
            if (!text1 || !text2) {
                res.status(400).json({
                    code: 400,
                    msg: "Invalid parameters",
                    timestamp: time()
                });
                return;
            }
            try {
                const r = await fetch("https://free.amethyst.ltd/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer sk-AmethystFree`,
                        "Content-Type": "application/json",
                        Origin: "https://iftc.koyeb.app"
                    },
                    body: JSON.stringify({
                        model: "gemini-2.5-pro",
                        provider: "azureml",
                        temperature: 0.5,
                        top_p: 1,
                        messages: [{
                            role: "system",
                            content: `你的任务是判断两段文本的相似度。
相似度要求：
计算给出两段文本的含义、长度、内容等综合的相似度。
给出文本的格式：
第一段文本：{text1}
第二段文本：{text2}
输出格式为数值，取值范围为0到1，保留2为小数`
                        }, {
                            role: "user",
                            content: `第一段文本：${text1}
第二段文本：${text2}`
                        }]
                    })
                })
                const data = await r.json();
                console.log(data)
                if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                    const result = data.choices[0].message.content;
                    console.log(result)
                    res.status(200).json({
                        code: 200,
                        msg: "请求成功",
                        data: Number(result),
                        timestamp: time(),
                    })
                }
            } catch (e) {
                res.status(500).json({
                    code: 500,
                    msg: "Internal Server Error",
                    error: e.message,
                    timestamp: time()
                });
            }
        })
        this.app.post("/api/aimgc", async (req, res) => {
            requestLog(req);
            const {
                text
            } = req.body;
            if (!text) {
                res.status(400).json({
                    code: 400,
                    msg: "Invalid parameters",
                    timestamp: time()
                });
                return;
            }
            try {
                const r = await fetch("https://free.amethyst.ltd/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer sk-AmethystFree`,
                        "Content-Type": "application/json",
                        Origin: "https://iftc.koyeb.app"
                    },
                    body: JSON.stringify({
                        model: "gemini-2.5-pro",
                        provider: "azureml",
                        temperature: 0.5,
                        top_p: 1,
                        messages: [{
                            role: "system",
                            content: `你的任务是根据上下文过滤敏感词，请返回敏感词列表，返回格式为JSON，例如：["xxx","xxx"]`,
                        }, {
                            role: "user",
                            content: `${text}`
                        }]
                    })
                })
                const data = await r.json();
                console.log(data)
                if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                    const result = data.choices[0].message.content.replace("```json", "").replace("```", "");
                    console.log(result)
                    res.status(200).json({
                        code: 200,
                        msg: "请求成功",
                        data: JSON.parse(result),
                        timestamp: time(),
                    })
                }
                if (data.error) {
                    res.status(500).json({
                        code: 500,
                        msg: "Internal Server Error",
                        error: data.error,
                        timestamp: time()
                    })
                }
            } catch (e) {
                res.status(500).json({
                    code: 500,
                    msg: "Internal Server Error",
                    error: e.message,
                    timestamp: time()
                });
            }
        })
        this.app.get("/api/aiocr", async (req, res) => {
            requestLog(req);
            const { img } = req.query;
            if (!img) {
                res.status(400).json({
                    code: 400,
                    msg: "Invalid parameters",
                    timestamp: time()
                });
                return;
            }
            try {
                const r = await fetch("https://free.amethyst.ltd/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer sk-AmethystFree`,
                        "Content-Type": "application/json",
                        Origin: "https://iftc.koyeb.app"
                    },
                    body: JSON.stringify({
                        model: "gemini-2.5-pro",
                        provider: "azureml",
                        temperature: 0.5,
                        top_p: 1,
                        messages: [
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: "仅识别图中文字"
                                    },
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: img
                                        }
                                    }
                                ]
                            }]
                    })
                })
                const data = await r.json();
                console.log(data)
                if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                    const result = data.choices[0].message.content;
                    console.log(result)
                    res.status(200).json({
                        code: 200,
                        msg: "识别成功",
                        data: result,
                    })
                } else {
                    res.status(500).json({
                        code: 500,
                        msg: "API响应格式错误",
                        error: data,
                        timestamp: time()
                    });
                }
            } catch (e) {
                res.status(500).json({
                    code: 500,
                    msg: "Internal Server Error",
                    error: e.message,
                    timestamp: time()
                });
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

module.exports = Other;