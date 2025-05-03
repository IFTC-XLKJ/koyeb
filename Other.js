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
                        const res = await fetch(src);
                        const code = await res.text();
                        const fun = eval(code);
                        console.log(fun, typeof fun);
                        const request = {
                            response: class {
                                constructor(content, options) {
                                    res.status(options.status || 200).send(content);
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