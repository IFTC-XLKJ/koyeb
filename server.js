const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs").promises;
const User = require("./User.js");
const UUIDdb = require("./UUID_db.js");
const crypto = require("crypto");
const Books = require("./Books.js");
const app = express();
app.use(bodyParser.json())
const port = process.env.PORT || 3000;
app.use("/static", express.static(path.join(__dirname, "static")));
let startTime;

app.get("/", async (req, res) => {
    requestLog(req);
    const params = {};
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        const content = await mixed("pages/index.html", params);
        if (typeof content !== "string") {
            throw new Error("Invalid content type");
        }
        console.log("Content:", content);
        console.log("Type of content:", typeof content);
        res.send(content);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            code: 500,
            msg: String(e),
            timestamp: time(),
        });
    }
});

app.all("/api", (req, res) => {
    requestLog(req);
    res.json({
        code: 200,
        msg: "请求成功",
        copyright: "IFTC",
        apis: [
            "获取用户数据 GET /user/details?id={用户ID(必填)}",
            "登录 GET /user/login?user={用户ID或昵称或邮箱(必填)}&password={密码(必填)}",
            "注册 GET /user/register?nickname={昵称(必填)}&email={邮箱(必填)}&password={密码(必填)}&avatar={头像(选填)}",
            "更新用户数据 GET /user/update?type={更新类型，包括：nickname、avatar、email、password(必填)}&id={用户ID(必填)}&password={密码(必填)}&data={要更新内容(必填)}",
            "发送验证码 GET /sendcode?email={邮箱(必填)}&title={邮件标题(必填)}&content={(邮件Base64内容，{captcha}为验证码部分(必填))}",
            "验证验证码 GET /verifycode?email={邮箱(必填)}&code={验证码(必填)}",
            "请求重置密码 GET /user/resetpassword?email={邮箱(必填)}&id={用户ID(必填)}&password={要重置的密码(必填)}",
            "重置密码 GET /user/reserpassword/{操作的UUID}"
        ],
        timestamp: time(),
    });
});

app.get("/api/book/search", async (req, res) => {
    requestLog(req);
    const { keyword } = req.query;
    if (keyword) { } else {
        res.status(400).json({
            code: 400,
            msg: "缺少keyword参数",
            timestamp: time(),
        });
    }
})

app.get("/api/runtime", (req, res) => {
    requestLog(req);
    res.json({
        code: 200,
        msg: "请求成功",
        runtime: formatDuration(Date.now() - startTime),
        timestamp: time(),
    });
})

app.get("/api/ip", (req, res) => {
    requestLog(req);
    const ip = req.headers["x-forwarded-for"] || null;
    res.json({
        code: 200,
        msg: "请求成功",
        ip: ip,
        timestamp: time(),
    });
})

app.get("/api/user/resetpassword", async (req, res) => {
    requestLog(req);
    const uuid = generateUUID();
    const { email, id, password } = req.query;
    console.log(typeof Number(id));
    if (Number.isNaN(Number(id))) {
        res.status(400).json({
            code: 400,
            msg: "id参数类型错误，必须为数值类型",
            timestamp: time(),
        });
    }
    if (email && (id || id == 0) && password) {
        const _password = password.replace(/井/g, "#")
        const UUID_db = new UUIDdb();
        try {
            const json = await UUID_db.addData(uuid, "resetpassword", id, _password);
            if (json.code == 200) {
                const url = `https://iftc.koyeb.app/api/user/resetpassword/${uuid}`
                const json2 = await UUID_db.sendEmail(email, "重置密码", `<!DOCTYPE html>
                    <html lang="zh-CN">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>重置密码</title>
                        </head>
                        <body>
                            <div>您好，您正在重置密码，还差最后一步，请访问<a href="${url}">${url}</a>完成密码重置</div>
                        </body>
                    </html>`)
                console.log(typeof json2)
                if (json2.status == 1) {
                    res.json({
                        code: 200,
                        msg: "请求成功",
                    });
                } else if (json2.code == 420) {
                    res.status(420).json({
                        code: 420,
                        msg: "1分钟内只能请求1次",
                        timestamp: time(),
                    });
                } else {
                    res.status(400).json({
                        code: 400,
                        msg: "请求失败",
                    });
                }
            } else {
                res.status(400).json({
                    code: 400,
                    msg: "请求失败",
                    timestamp: time(),
                });
            }
        } catch (e) {
            res.status(500).json({
                code: 500,
                msg: "服务内部错误，请联系官方(QQ:3164417130)",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少email或id或password参数",
            timestamp: time(),
        });
    }
})

app.get("/api/user/resetpassword/:uuid", async (req, res) => {
    requestLog(req);
    const { uuid } = req.params;
    if (uuid) {
        const user = new User();
        const UUID_db = new UUIDdb();
        const regexp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (regexp.test(uuid)) {
            try {
                const json = await UUID_db.getData(uuid);
                if (json.code == 200) {
                    const data = json.fields[0];
                    if (!data) {
                        res.status(400).json({
                            code: 404,
                            msg: "UUID不存在",
                            timestamp: time(),
                        });
                    }
                    if (data.类型 != "resetpassword") {
                        res.status(400).json({
                            code: 400,
                            msg: "UUID类型错误",
                            timestamp: time(),
                        });
                    }
                    const json2 = await user.resetPassword(data.ID, String(data.数据));
                    if (json2.code == 200) {
                        res.json({
                            code: 200,
                            msg: "密码重置成功",
                        });
                    } else {
                        res.status(400).json({
                            code: 400,
                            msg: "请求失败",
                            timestamp: time(),
                        });
                    }
                } else {
                    res.status(400).json({
                        code: 400,
                        msg: "请求失败",
                        timestamp: time(),
                    });
                }
            } catch (e) {
                res.status(500).json({
                    code: 500,
                    msg: "服务内部错误，请联系官方(QQ:3164417130)",
                    error: String(e),
                    timestamp: time(),
                });
            }
        } else {
            res.status(400).json({
                code: 400,
                msg: "UUID格式错误"
            })
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少uuid参数"
        })
    }
})

app.get("/api/verifycode", async (req, res) => {
    requestLog(req);
    const { email, code } = req.query;
    console.log(email, code);
    if (email && code) {
        const user = new User();
        try {
            const json = await user.verifyCode(email, code);
            if (json.code == 200) {
                res.json({
                    code: 200,
                    msg: "验证成功",
                });
            } else {
                res.status(400).json({
                    code: 400,
                    msg: "验证失败",
                });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({
                code: 500,
                msg: "服务内部错误，请联系官方(QQ:3164417130)",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少email或code参数",
            timestamp: time(),
        });
    }
})

app.get("/api/sendcode", async (req, res) => {
    requestLog(req);
    const { email, title, content } = req.query;
    console.log(email, title, content);
    if (email && title && content) {
        const user = new User();
        try {
            const json = await user.sendCode(email, title, content);
            if (json.status == 1) {
                res.json({
                    code: 200,
                    msg: "发送成功",
                });
            } else {
                res.status(400).json({
                    code: 400,
                    msg: "发送失败",
                });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({
                code: 500,
                msg: "服务内部错误，请联系官方(QQ:3164417130)",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少email或title或content参数",
            timestamp: time(),
        });
    }
})

app.get("/api/user/update", async (req, res) => {
    requestLog(req);
    const { type, id, password, data } = req.query;
    console.log(typeof Number(id));
    if (Number.isNaN(Number(id))) {
        res.status(400).json({
            code: 400,
            msg: "id参数类型错误，必须为数值类型",
            timestamp: time(),
        });
    }
    if (type && (id || id == 0) && password && data) {
        const user = new User();
        const _password = password.replace(/井/g, "#");
        const _data = data.replace(/井/g, "#");
        try {
            const json = await user.update(type, id, _password, _data);
            if (json.code == 200) {
                res.json({
                    code: 200,
                    msg: "账号数据更新成功",
                    id: Number(id),
                })
            } else {
                res.status(400).json({
                    code: 400,
                    msg: "账号数据更新失败",
                });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({
                code: 500,
                msg: "服务内部错误，请联系官方(QQ:3164417130)",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少type或id或password或data参数",
            timestamp: time(),
        });
    }
});

app.get("/api/user/register", async (req, res) => {
    requestLog(req);
    const { nickname, avatar, email, password } = req.query;
    if (nickname && email && password) {
        const _password = password.replace(/井/g, "#");
        const user = new User();
        try {
            const json = await user.register(email, password, nickname, avatar ? avatar : "https://iftc.koyeb.app/static/avatar.png");
            if (json.code == 200) {
                res.json({
                    code: 200,
                    msg: "注册成功",
                    id: json.id,
                });
            } else {
                res.status(json.code).json({
                    code: json.code,
                    msg: json.msg,
                });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({
                code: 500,
                msg: "服务内部错误，请联系官方(QQ:3164417130)",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少nickname或email或password参数",
            timestamp: time(),
        });
    }
});

app.get("/api/user/login", async (req, res) => {
    requestLog(req)
    const { user, password } = req.query;
    console.log(user, password);
    if ((user || user == 0) && password) {
        const _user = user.replace(/井/g, "#");
        const _password = password.replace(/井/g, "#");
        const auser = new User();
        try {
            const json = await auser.login(_user, _password);
            if (json.code == 200) {
                const data = json.fields[0];
                if (!data) {
                    res.status(404).json({
                        code: 401,
                        msg: "账号或密码错误",
                        timestamp: time(),
                    });
                }
                res.json({
                    code: 200,
                    msg: "登录成功",
                    id: data.ID,
                });
            } else {
                res.status(json.code).json({
                    code: json.code,
                    msg: json.msg,
                });
            }
        } catch (e) {
            res.status(500).json({
                code: 500,
                msg: "服务内部错误，请联系官方(QQ:3164417130)",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少user或password参数",
            timestamp: time(),
        });
    }
});

app.get("/api/user/details", async (req, res) => {
    requestLog(req);
    const { id } = req.query;
    console.log(typeof Number(id));
    if (Number.isNaN(Number(id))) {
        res.status(400).json({
            code: 400,
            msg: "id参数类型错误，必须为数值类型",
            timestamp: time(),
        });
    }
    if (id) {
        const user = new User();
        try {
            const json = await user.getByID(id);
            if (json.code == 200) {
                const data = json.fields[0];
                if (!data) {
                    res.status(404).json({
                        code: 404,
                        id: id,
                        msg: "账号不存在",
                        timestamp: time(),
                    });
                }
                res.json({
                    code: 200,
                    msg: "账号数据获取成功",
                    data: {
                        ID: data.ID,
                        username: String(data.昵称),
                        avatar: data.头像,
                        VC: data.V币,
                        email: data.邮箱,
                        VIP: !!data.VIP,
                        signed: data.签到,
                        op: data.管理员 == 1,
                        freezed: data.封号 == 1,
                        title: data.头衔,
                        titleColor: data.头衔色,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                    },
                    timestamp: time(),
                });
            } else {
                res.status(json.code).json({
                    code: json.code,
                    msg: json.msg,
                });
            }
        } catch (e) {
            res.status(500).json({
                code: 500,
                msg: "服务内部错误，请联系官方(QQ:3164417130)",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少id参数",
            timestamp: time(),
        });
    }
});

app.get("/api/console/clear", (req, res) => {
    console.clear();
    res.json({
        code: 200,
        msg: "清除成功",
        timestamp: time(),
    });
})

app.listen(port, () => {
    startTime = Date.now();
    console.log(`服务器已在端口 ${port} 开启`);
});

function time() {
    return Date.now();
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function md5Hash(input) {
    const hash = crypto.createHash("md5");
    hash.update(input);
    return hash.digest("hex");
}

function formatDuration(milliseconds) {
    let ms = milliseconds % 1000;
    let s = Math.floor((milliseconds / 1000) % 60);
    let m = Math.floor((milliseconds / (1000 * 60)) % 60);
    let h = Math.floor(milliseconds / (1000 * 60 * 60));
    return `${String(h).padStart(2, '0')}时${String(m).padStart(2, '0')}分${String(s).padStart(2, '0')}秒${String(ms).padStart(3, '0')}毫秒`;
}

async function mixed(filepath, params) {
    try {
        let content = await fs.readFile(filepath, "utf-8");
        const keys = Object.keys(params);
        console.log(keys);
        keys.forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, "g");
            content = content.replace(regex, params[key]);
        });
        return content;
    } catch (error) {
        throw error;
    }
}

function requestLog(req) {
    if (req.headers["user-agent"] == "Koyeb Health Check") {
        return;
    }
    console.log(`收到请求 IP: ${req.ip}或${req.headers["x-forwarded-for"]} UA: ${req.headers["user-agent"]}`)
    console.log(`Method: ${req.method} URL: ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
}

setInterval(() => {
    const time = new Date().toLocaleString();
    console.log("服务器正在运行中...", time);
}, 30000);