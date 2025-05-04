const path = require("path");
const fs = require("fs").promises;
const UUID_db = require("./UUID_db.js");
const fetch = require("node-fetch");

const uuid_db = new UUID_db();

class Other {
    constructor(app) {
        this.app = app;
        this.app.get("/file/blockly/workspace-search", async (req, res) => {
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
        this.app.get("/file/blockly/shadow-block-converter", async (req, res) => {
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
        this.app.all("/api/cloudfun/:uuid", async (req, res) => {
            const {
                uuid
            } = req.params;
            try {
                const json = await uuid_db.getData(uuid);
                if (json.code == 200) {
                    const data = json.fields[0];
                    if (!data) {
                        res.status(404).json({
                            code: 404,
                            msg: "未找到数据",
                            timestamp: time(),
                        });
                        return;
                    }
                    if (data.类型 == "cloudfun") {
                        const ID = data.ID;
                        const src = data.数据;
                        const response = await fetch(src);
                        const code = await response.text();
                        const fun = eval(`globalThis.require = null;
                        var require = async function(src) {
                            const response = await fetch(src);
                            const code = await response.text();
                            return eval(code);
                        };\n${code}`);
                        console.log(fun, typeof fun);
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
                                    async #post(url, type, filter, fields, page, limit) {
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
                                    async get() { }
                                }
                            },
                        };
                        fun(request);
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
                res.status(500).send(null);
            }
        });
        console.log("Other");
    }
    async getFile(path) {
        try {
            const content = await fs.readFile(path, "utf-8");
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

module.exports = Other;