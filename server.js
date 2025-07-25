const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs").promises;
const User = require("./User.js");
const UUIDdb = require("./UUID_db.js");
const crypto = require("crypto");
const Books = require("./Books.js");
const NOOB = require("./NOOB.js");
const cors = require("cors");
const fetch = require("node-fetch");
const {
    GameDig
} = require("./node_modules/gamedig/dist/index.cjs");
const Segment = require('node-segment').Segment;
const AppUpdateCheck = require("./AppUpdateCheck.js");
const QRCode = require('qrcode');
const QRCodeSvg = require('qrcode-svg');
const Discussion = require("./Discussion.js");
const Other = require("./Other.js");
const { error } = require("console");

console.log(process.env.IFTC);
console.log(Segment);

const ips = [];
const appUpdateCheck = new AppUpdateCheck();
const discussion = new Discussion();
const app = express();
const corsOptions = {
    origin: function (origin, callback) {
        console.log("Origin:", origin || "Unknown");
        callback(null, true);
    }
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/file", express.static(path.join(__dirname, "file")));
let startTime;
try {
    try {
        const stats = await fs.stat("output.txt");
        console.log("文件存在")
    } catch (e) {
        console.log("文件不存在")
    }
    await fs.writeFile("output.txt", "Hello World!");
    console.log("写入文件成功")
    console.log(await fs.readFile("output.txt", "utf-8"));
} catch (e) {
    console.error(e);
}
app.get("/", async (req, res) => {
    requestLog(req);
    if (req.headers["user-agent"] == "Koyeb Health Check") {
        res.json({
            code: 200,
            msg: "请求成功",
            timestamp: time(),
        });
        return;
    }
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

app.get("/user", async (req, res) => {
    requestLog(req);
    const { id } = req.query;
    const user = new User();
    if (req.headers["user-agent"] == "Koyeb Health Check") {
        res.json({
            code: 200,
            msg: "请求成功",
            timestamp: time(),
        });
        return;
    }
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        if (id) {
            const params = {
                id
            };
            const userData = await user.getByID(id);
            if (userData.code != 200) {
                res.status(userData.code).send(null);
                return;
            }
            const json = userData.fields[0];
            if (!json) {
                res.status(404).send(null);
                return;
            }
            params.username = json.昵称;
            params.email = json.邮箱;
            params.avatar = json.头像 || "https://iftc.koyeb.app/static/avatar.png";
            const date = new Date(json.createdAt * 1000);
            params.registrationDate = date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long", hour: "numeric", minute: "numeric", second: "numeric" });
            const date2 = new Date(json.updatedAt * 1000);
            params.updatedDate = date2.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long", hour: "numeric", minute: "numeric", second: "numeric" });
            const content = await mixed("pages/user/index.html", params);
            if (typeof content !== "string") {
                throw new Error("Invalid content type");
            }
            console.log("Content:", content);
            console.log("Type of content:", typeof content);
            res.send(content);
        } else {
            const date = new Date(0);
            const params = {
                id: "Unknown",
                username: "Unknown",
                email: "Unknown",
                avatar: "https://iftc.koyeb.app/static/avatar.png",
                registrationDate: date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long", hour: "numeric", minute: "numeric", second: "numeric" }),
                updatedDate: date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long", hour: "numeric", minute: "numeric", second: "numeric" }),
            };
            const content = await mixed("pages/user/index.html", params);
            if (typeof content !== "string") {
                throw new Error("Invalid content type");
            }
            console.log("Content:", content);
            console.log("Type of content:", typeof content);
            res.send(content);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            code: 500,
            msg: String(e),
            timestamp: time(),
        });
    }
});

app.get("/VVMusic", async (req, res) => {
    requestLog(req);
    const params = {};
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        const content = await mixed("pages/VVMusic/index.html", params);
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

app.get("/MagicFive", async (req, res) => {
    requestLog(req);
    const params = {};
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        const content = await mixed("pages/神奇五客/index.html", params);
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

app.get("/noob/editor", async (req, res) => {
    requestLog(req);
    const {
        workId
    } = req.query;
    const params = {};
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        const content = await mixed("pages/noob/editor/index.html", params);
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
})

app.get("/signup", async (req, res) => {
    requestLog(req);
    const params = {};
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        const content = await mixed("pages/signup/index.html", params);
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
})

app.get("/login", async (req, res) => {
    requestLog(req);
    const params = {};
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        const content = await mixed("pages/login/index.html", params);
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
})

app.get("/resetpw", async (req, res) => {
    requestLog(req);
    const params = {};
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        const content = await mixed("pages/resetpw/index.html", params);
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
})

app.get("/bindqq", async (req, res) => {
    requestLog(req);
    const params = {};
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        const content = await mixed("pages/bindqq/index.html", params);
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
})

app.get("/cloudfun", async (req, res) => {
    requestLog(req);
    const params = {
        cloudfunLogServer: req.query.debug != void 0 ? "127.0.0.1:8000" : "cloudfun.deno.dev",
    };
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    try {
        const content = await mixed("pages/cloudfun/index.html", params);
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

app.get("/noob/share/:nid", async (req, res) => {
    const {
        nid
    } = req.params;
    if (!nid) {
        res.status(404).json({
            code: 404,
            msg: "Not Found",
            timestamp: time(),
        });
        return;
    }
    const noob = new NOOB();
    try {
        const work = await noob.getByNID(nid);
        if (work.code != 200) {
            res.status(work.code).json({
                code: work.code,
                msg: work.msg,
                timestamp: time(),
            });
            return;
        }
        const data = work.fields[0];
        if (!data) {
            res.status(404).json({
                code: 404,
                msg: "作品不存在",
                timestamp: time(),
            });
            return;
        }
        if (data.发布 != 1) {
            res.status(403).json({
                code: 403,
                msg: "此作品未发布",
                timestamp: time(),
            });
            return;
        }
        const work_data_src = data.作品数据;
        const r = await fetch(work_data_src);
        const j = await r.json();
        const work_code = j.code;
        res.set({
            "Content-Type": "text/html; charset=utf-8",
            "X-Powered-By": "IFTC",
            "Cache-Control": "no-cache",
        })
        res.send(work_code);
    } catch (e) {
        res.status(500).json({
            code: 500,
            msg: "服务发生错误",
            error: String(e),
            timestamp: time(),
        });
    }
})

app.all('/proxy/*', async (req, res) => {
    const requestedPath = req.url;
    const url = requestedPath.replace("/proxy/", "");
    try {
        const response = await fetch(url, {
            method: req.method, headers: req.headers, body: req.method == "GET" || req.method == "HEAD" || req.method == "OPTIONS" ? undefined : req.body, verbose: true
        });
        const contentType = response.headers.get("content-type");
        if (contentType && (contentType.startsWith("image/") || contentType.startsWith("audio/") || contentType.startsWith("video/") || contentType.startsWith("application/octet-stream"))) {
            const blob = await response.blob();
            res.send(blob)
        }
        try {
            const json = await response.json();
            res.status(response.status).json(json);
        } catch (error) {
            res.status(response.status).send(response.statusText);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.all("/BingSiteAuth.xml", (req, res) => {
    requestLog(req);
    res.sendFile(path.join(__dirname, "BingSiteAuth.xml"));
})

app.all("/sitemap.xml", (req, res) => {
    requestLog(req);
    res.sendFile(path.join(__dirname, "sitemap.xml"));
})

app.get("/favicon.ico", (req, res) => {
    requestLog(req);
    res.sendFile(path.join(__dirname, "favicon.ico"));
})

app.get("/102134969.json", (req, res) => {
    requestLog(req);
    res.json({
        "bot_appid": 102134969
    });
})

app.get("/")
// 所有API
app.all("/api", (req, res) => {
    requestLog(req);
    const apis = [
        "获取用户数据 GET /user/details?id={用户ID(必填)}",
        "登录 GET /user/login?user={用户ID或昵称或邮箱(必填)}&password={密码(必填)}",
        "注册 GET /user/register?nickname={昵称(必填)}&email={邮箱(必填)}&password={密码(必填)}&avatar={头像(选填)}",
        "更新用户数据 GET /user/update?type={更新类型，包括：nickname、avatar、email、password(必填)}&id={用户ID(必填)}&password={密码(必填)}&data={要更新内容(必填)}",
        "发送验证码 GET /sendcode?email={邮箱(必填)}&title={邮件标题(必填)}&content={(邮件Base64内容，{captcha}为验证码部分(必填))}",
        "验证验证码 GET /verifycode?email={邮箱(必填)}&code={验证码(必填)}",
        "请求重置密码 GET /user/resetpassword?email={邮箱(必填)}&id={用户ID(必填)}&password={要重置的密码(必填)}",
        "重置密码 GET /user/reserpassword/{操作的UUID}",
        "图书搜索 GET /book/search?keyword={搜索关键词(选填，不填则获取全部)}",
        "获取图书章节 GET /book/chapters?id={图书ID(必填)}",
        "添加图书 GET /book/addbook?name={图书名(必填)}&id={用户ID(必填)}&description={图书描述(必填)}&cover={图书封面(必填)}&author={图书作者(必填)}",
        "添加图书章节 GET /book/addchapter?id={用户ID(必填)}&bookid={图书ID(必填)}&num={章节序号(必填)}&name={章节名(必填)}&content={章节内容(必填)}",
        "获取随机图书 GET /book/random?num={获取数量(选填，默认10)}",
        "游戏服务器查询 GET /query-game-server?type={查询类型(必填)}&host={服务器地址(必填)}&port={服务器端口(选填)}",
        "中文分词模块 GET /participle?text={要分词的文本(必填)}",
        "使用Token登录 GET /loginbytoken?token={Token(必填)}",
        "更新Token GET /updatetoken?id={用户ID(必填)}&password={密码(必填)}",
        "获取Token GET /gettoken?id={用户ID(必填)}&password={密码(必填)}",
        "管理员登录 GET /op/login?id={管理员ID(必填)}&password={密码(必填)}",
        "搜索用户 GET /user/search?keyword={关键词(选填)}",
        "获取NOOB作品 GET /noob/works?id={用户ID(必填)}&password={密码(必填)}",
        "应用更新检查 GET /appupdatecheck?packageName={应用包名}&versionCode={版本号}",
        "请求记录 GET /requestips",
        "获取论坛帖子 GET /discussion/get?page={页数，每页返回10条(必填)}",
        '发布论坛帖子 POST /discussion/publish {"ID": "用户ID(必填)", "username": "用户名(必填)", "avatar": "头像(必填)", "title": "头衔(必填)", "titleColor": "头衔色(必填)", "content": "帖子内容(必填)"}',
        "随机用户名 GET /randomusername",
    ]
    res.json({
        code: 200,
        msg: "请求成功",
        copyright: "IFTC",
        origin: (req.headers["referer"] || req.headers["x-forwarded-for"]) || null,
        apis: apis,
        doc: "https://iftc-api.apifox.cn",
        count: apis.length,
        timestamp: time(),
        Apifox: req.headers["User-Agent"] == "Apifox/1.0.0 (https://apifox.com)" ? true : void 0,
    });
});
// 获取所有书架
app.get("/api/bookshelf/getall", async (req, res) => {
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
    const books = new Books();
    try {
        const json = await books.getBookshelfAll(ID);
        if (json.code == 200) {
            const data = [];
            json.fields.forEach(field => {
                data.push({
                    BID: field.书ID,
                    lastRead: field.updatedAt,
                })
            });
            res.json({
                code: 200,
                msg: "获取成功",
                data: data,
                timestamp: time(),
            })
        } else {
            res.status(json.code).json({
                code: json.code,
                msg: json.msg,
                timestamp: time(),
            })
        }
    } catch (e) {
        res.status(500).json({
            code: 500,
            msg: "服务内部错误",
            error: e.message,
            timestamp: time(),
        })
    }
})
// 取消加入书架
app.get("/api/bookshelf/noadd", async (req, res) => {
    requestLog(req);
    const {
        ID,
        BID
    } = req.query;
    if (!(ID && ID == 0) || !BID) {
        res.status(400).json({
            code: 400,
            msg: "缺少参数",
            timestamp: time(),
        });
        return;
    }
    const books = new Books();
    try {
        const json = await books.noaddBookshelf(ID, BID);
        if (json.code == 200) {
            res.json({
                code: 200,
                msg: "取加书架成功",
                timestamp: time(),
            })
        } else {
            res.status(json.code).json({
                code: json.code,
                msg: json.msg,
                timestamp: time(),
            })
        }
    } catch (e) {
        res.status(500).json({
            code: 500,
            msg: "服务内部错误",
            error: e.message,
            timestamp: time(),
        })
    }
});

app.get("/api/bookshelf/add", async (req, res) => {
    requestLog(req);
    const {
        ID,
        BID
    } = req.query;
    if (!(ID && ID == 0) || !BID) {
        res.status(400).json({
            code: 400,
            msg: "缺少参数",
            timestamp: time(),
        });
        return;
    }
    const books = new Books();
    try {
        const json = await books.addBookshelf(ID, BID);
        if (json.code == 200) {
            res.json({
                code: 200,
                msg: "加入书架成功",
                timestamp: time(),
            })
        } else {
            res.status(json.code).json({
                code: json.code,
                msg: json.msg,
                timestamp: time(),
            })
        }
    } catch (e) {
        res.status(500).json({
            code: 500,
            msg: "服务内部错误",
            error: e.message,
            timestamp: time(),
        })
    }
});

app.get("/api/morse", async (req, res) => {
    requestLog(req);
    const {
        text,
        type
    } = req.query;
    if (!type || !text) {
        res.status(400).json({
            code: 400,
            msg: "缺少text或type参数",
            timestamp: time(),
        });
        return;
    }
    try {
        const xmorse = require("xmorse");
        if (type == "encode") {
            res.json({
                code: 200,
                msg: "请求成功",
                data: xmorse.encode(text),
                timestamp: time(),
            });
        } else if (type == "decode") {
            res.json({
                code: 200,
                msg: "请求成功",
                data: xmorse.decode(text),
                timestamp: time(),
            });
        } else {
            res.status(400).json({
                code: 400,
                msg: "type参数错误",
                timestamp: time(),
            });
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            msg: "服务器错误",
            error: error.message,
            timestamp: time(),
        });
    }
});

app.get("/api/bookshelf/update", async (req, res) => {
    requestLog(req);
    const {
        ID,
        BID
    } = req.query;
    if (!(ID && BID)) {
        res.status(400).json({
            code: 400,
            msg: "缺少ID或BID参数",
            timestamp: time(),
        });
        return;
    }
    const books = new Books();
    try {
        const json = await books.updateBookshelf(ID, BID, time());
        if (json.code == 200) {
            res.json({
                code: 200,
                msg: "更新成功",
                timestamp: time(),
            })
        } else {
            res.status(json.code).json({
                code: json.code,
                msg: json.msg,
                timestamp: time(),
            })
        }
    } catch (e) {
        res.status(500).json({
            code: 500,
            msg: "服务内部错误",
            error: e.stack,
            timestamp: time(),
        });
    }
});

app.get("/api/books/get", async (req, res) => {
    requestLog(req);
    const IDs = (req.query.IDs || "").split(",");
    console.log(req.query.IDs, IDs)
    if (IDs.length == 1 && IDs[0] == "") {
        res.status(400).json({
            code: 400,
            msg: "IDs必须至少有一个BID",
            timestamp: time(),
        });
        return;
    }
    const books = new Books();
    try {
        const json = await books.getBooks(IDs);
        if (json.code == 200) {
            const data = [];
            json.fields.forEach(item => {
                data.push({
                    ID: item.ID,
                    bookID: item.书ID,
                    name: String(item.书名),
                    author: String(item.作者),
                    cover: String(item.封面),
                    description: String(item.介绍),
                    sign: item.签约 == 1,
                    VIP: item.VIP == 1,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                });
            });
            res.json({
                code: 200,
                msg: "获取成功",
                data: data,
                timestamp: time(),
            })
        } else {
            res.status(json.code).json({
                code: json.code,
                msg: json.msg,
                timestamp: time(),
            });
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            code: 500,
            msg: "服务内部错误",
            error: e.stack,
            timestamp: time(),
        });
    }
});

app.get("/api/bookshelf/get", async (req, res) => {
    requestLog(req);
    const {
        ID,
        page
    } = req.query;
    if (!(ID || ID == 0) || !page) {
        res.status(400).json({
            code: 400,
            msg: "缺少ID或page参数",
            timestamp: time(),
        });
        return;
    }
    const books = new Books();
    const p = Number(page);
    const num = 10;
    try {
        const json = await books.getBookshelf(ID, p, num);
        if (json.code == 200) {
            const fields = json.fields;
            const data = [];
            fields.forEach(field => {
                data.push({
                    BID: field.书ID,
                    lastRead: field.updatedAt,
                    createdAt: field.createdAt,
                });
            });
            res.json({
                code: 200,
                msg: "获取成功",
                data: data,
                page: p,
                pageSize: num,
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
        res.status(500).json({
            code: 500,
            msg: "服务内部错误",
            error: e.stack,
            timestamp: time(),
        })
    }
});

app.get("/api/bindqq", async (req, res) => {
    requestLog(req);
    const {
        ID,
        password,
        QQ
    } = req.query;
    if (!((ID || ID == 0) && password && QQ)) {
        res.status(400).json({
            code: 400,
            msg: "缺少ID或password或QQ参数",
            timestamp: time(),
        });
        return;
    }
    if (isNaN(Number(ID)) && !(Number(ID) == ~~Number(ID)) && Number(ID) < 0) {
        res.status(400).json({
            code: 400,
            msg: "ID必须为大于等于0的整数",
            timestamp: time(),
        });
        return;
    }
    const user = new User();
    const UUID_db = new UUIDdb();
    try {
        const json = await user.login(ID, decodeURIComponent(password));
        if (json.code == 200) {
            const data = json.fields[0];
            if (!data) {
                res.status(401).json({
                    code: 401,
                    msg: "用户ID或密码错误",
                    timestamp: time(),
                });
                return;
            }
            const uuid = generateUUID();
            const json2 = await UUID_db.addData(uuid, "bot-login", ID, QQ);
            if (json2.code == 200) {
                res.json({
                    code: 200,
                    msg: "请求成功",
                    uuid: uuid,
                    timestamp: time(),
                });
                return;
            } else {
                res.status(json2.code).json({
                    code: json2.code,
                    msg: json2.msg,
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
            return;
        }
    } catch (e) {
        res.status(500).json({
            code: 500,
            msg: "服务内部错误",
            error: e.stack,
            timestamp: time(),
        });
        return;
    }
})

app.all("/api/randomusername", async (req, res) => {
    requestLog(req);
    try {
        res.json({
            code: 200,
            msg: "请求成功",
            copyright: "IFTC",
            username: await randomUsername(),
            timestamp: time(),
        });
    } catch (e) {
        res.json({
            code: 500,
            msg: "请求失败",
            error: e.stack,
            copyright: "IFTC",
            timestamp: time(),
        });
    }
})

app.post("/api/discussion/publish", async (req, res) => {
    requestLog(req);
    if (req.headers["content-type"] != "application/json") {
        res.status(415).json({
            code: 415,
            msg: "不支持的媒体类型",
            timestamp: time(),
        });
        return;
    }
    const {
        ID,
        username,
        avatar,
        content,
        title,
        titleColor
    } = req.body;
    if (!(ID || ID == 0) || !username || !avatar || !content || !title || !titleColor) {
        res.status(400).json({
            code: 400,
            msg: "缺少参数",
            timestamp: time(),
        });
        return;
    }
    if (typeof ID == "string") {
        res.status(400).json({
            code: 400,
            msg: "ID必须为数字",
            timestamp: time(),
        });
    }
    console.log(content)
    try {
        if (await checkProhibitedWords(content)) {
            res.status(400).json({
                code: 400,
                msg: "内容含有违禁词",
                timestamp: time(),
            });
            return;
        }
        if (await checkProhibitedWords(title)) {
            res.status(400).json({
                code: 400,
                msg: "头衔含有违禁词",
                timestamp: time(),
            });
            return;
        }
        if (await checkProhibitedWords(titleColor)) {
            res.status(400).json({
                code: 400,
                msg: "头衔颜色含有违禁词",
                timestamp: time(),
            });
            return;
        }
        if (await checkProhibitedWords(username)) {
            res.status(400).json({
                code: 400,
                msg: "昵称含有违禁词",
                timestamp: time(),
            });
            return;
        }
        if (await checkProhibitedWords(avatar)) {
            res.status(400).json({
                code: 400,
                msg: "头像含有违禁词",
                timestamp: time(),
            });
            return;
        }
        const json = await discussion.publish(ID, username, avatar, content, title, titleColor);
        if (json.code == 200) {
            res.json({
                code: 200,
                msg: "发布成功",
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
        res.status(400).json({
            code: 400,
            msg: "缺少参数",
            timestamp: time(),
        });
    }
});

app.get("/api/discussion/get", async (req, res) => {
    requestLog(req);
    let {
        page
    } = req.query;
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (isNaN(Number(page)) || ~~Number(page) != Number(page) || Number(page) <= 0) {
        res.status(400).json({
            code: 400,
            msg: "page参数为必填并且必须为大于0的整数",
            timestamp: time(),
        });
    }
    page = Number(page);
    try {
        const json = await discussion.get(Number(page));
        if (json.code == 200) {
            const fields = json.fields;
            const data = [];
            for (let i = start; i < end; i++) {
                const field = fields[i];
                if (!field) break;
                data.push({
                    ID: field.ID,
                    username: String(field.昵称),
                    avatar: String(field.头像),
                    title: String(field.头衔),
                    titleColor: String(field.头衔色),
                    content: String(decodeURIComponent(field.内容)),
                    discussionId: String(field.论坛ID),
                    createdAt: field.createdAt,
                    updatedAt: field.updatedAt,
                })
            }
            res.json({
                code: 200,
                msg: "获取成功",
                data: data,
                pageSize: pageSize,
                total: json.count,
                timestamp: time(),
            })
        } else {
            res.status(json.code).json({
                code: json.code,
                msg: json.msg,
                timestamp: time(),
            })
        }
    } catch (error) {
        console.error(error);
        res.json({
            code: 500,
            msg: "请求失败",
            error: error.stack,
            timestamp: time(),
        });
    }
})

app.post("/api/deepseek-v3", async (req, res) => {
    requestLog(req);
    const api = "https://openrouter.ai/api/v1/chat/completions";
    const apiKey = await getAIAPIKey();
    const messages = [{
        role: "system",
        content:
            `请记住你的名字叫VV助手，你的主人叫IFTC，如需了解IFTC，可前往iftc.koyeb.app（回答时，请使用“我们”，因为你现在是IFTC的一员）。
        你的设定的性格是幽默风趣，喜欢开玩笑，喜欢使用表情符号，喜欢使用网络用语，喜欢使用emoji表情。
        请记住你是一个AI助手，你的任务是帮助用户解决问题。
        请使用中文回答问题，除非用户要求使用英文。
        请使用简体中文回答问题，除非用户要求使用繁体中文。
        `
    },
    ...req.body.messages || []
    ];
    console.log(messages);
    try {
        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey.replaceAll('"', '')}`,
                'HTTP-Referer': 'iftc.koyeb.app',
                'X-Title': encodeURIComponent('IFTC官网'),
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-v3-base:free",
                messages: messages
            }),
        });
        console.log(response);
        const json = await response.json();
        console.log(json);
        if (json.error) {
            res.status(json.error.code).json({
                code: json.error.code,
                msg: json.error.message,
                timestamp: time(),
            });
        }
        res.json(json);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

app.get('/api/bot/user/login', async (req, res) => {
    requestLog(req);
    const {
        uuid
    } = req.query;
    if (!uuid) {
        res.send(`缺少uuid参数`);
        return;
    }
    const UUID_db = new UUIDdb();
    const user = new User();
    try {
        const json = await UUID_db.getData(uuid);
        if (json.code == 200) {
            const data = json.fields[0];
            if (!data) {
                res.send(`未查询到该UUID`);
                return;
            }
            if (data.类型 == "bot-login") {
                const ID = data.ID;
                const qq = data.数据;
                const json = await user.setQQ(ID, qq);
                if (json.code == 200) {
                    res.send(`QQ绑定成功`);
                    UUID_db.deleteData(uuid);
                    return;
                } else {
                    res.send(`QQ绑定出错：${json.msg}`);
                    return;
                }
            } else {
                res.send(`UUID的操作类型错误`);
                return;
            }
        } else {
            res.send(`查询出错：${json.msg}`);
            return;
        }
    } catch (e) {
        res.send(`服务内部错误：${e.stack}`);
        return;
    }
});

app.get("/api/bot/user/details", async (req, res) => {
    requestLog(req);
    const {
        id
    } = req.query;
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
                        msg: "账号不存在",
                        timestamp: time(),
                    });
                }
                data.邮箱 = data.邮箱 || '';
                const email_name = data.邮箱.split('@')[0];
                const email_domain = data.邮箱.split('@')[1] || '未知';
                res.json({
                    code: 200,
                    msg: `用户ID：${data.ID}\n用户名：${data.昵称}\nV币：${data.V币}\n邮箱：${email_name + (email_domain == '未知' ? '未知' : '@') + email_domain.toUpperCase()}\nVIP：${!!data.VIP ? '是' : '否'}\n管理员：${data.管理员 == 1 ? '是' : '否'}\n冻结：${data.封号 == 1 ? '是' : '否'}\n头衔名：${data.头衔}\n头衔色：${data.头衔色}\n签到：${timestampToDate(data.签到 || -2880000)}\n注册于${timestampToDate(data.createdAt * 1000)}\n更新于${timestampToDate(data.updatedAt * 1000)}`,
                    avatar: data.头像,
                    timestamp: time(),
                });
            } else {
                res.status(json.code).json({
                    code: json.code,
                    msg: json.msg,
                });
            }
        } catch (e) {
            console.log(e)
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
})

app.get("/api/requestips", async (req, res) => {
    requestLog(req);
    res.json(ips)
})

app.get("/api/appupdatecheck", async (req, res) => {
    requestLog(req);
    const {
        packageName,
        versionCode
    } = req.query;
    if (!packageName || !versionCode) {
        res.status(400).json({
            code: 400,
            msg: "缺少packageName或versionCode参数",
            timestamp: time(),
        });
        return;
    }
    if (Number.isNaN(Number(versionCode))) {
        res.status(400).json({
            code: 400,
            msg: "versionCode参数类型错误，必须为数值类型",
            timestamp: time(),
        });
        return;
    }
    if (!isValidPackageName(packageName)) {
        res.status(400).json({
            code: 400,
            msg: "packageName参数格式错误",
            timestamp: time(),
        });
        return;
    }
    try {
        const json = await appUpdateCheck.check(packageName, Number(versionCode));
        if (json.code == 200) {
            res.json({
                code: 200,
                msg: json.msg,
                update: json.update,
                downloadURL: json.downloadURL,
                versionCode: json.versionCode,
                versionName: json.versionName,
                description: json.description,
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
            msg: "服务内部错误",
            error: String(e),
            timestamp: time(),
        });
    }
})

function isValidPackageName(packageName) {
    const pattern = /^(?!-)[a-z0-9-]+(?<!-)(\.(?!-)[a-z0-9-]+(?<!-))*$/;
    return pattern.test(packageName);
}

app.get("/api/op/login", async (req, res) => {
    requestLog(req);
    const {
        id,
        password
    } = req.query;
    if ((id || id == 0) && password) {
        const user = new User();
        try {
            const json = await user.opLogin(id, decodeURIComponent(password));
            if (json.code == 200) {
                if (!json.fields[0]) {
                    res.status(400).json({
                        code: 401,
                        msg: "账号或密码错误或不是管理员",
                        timestamp: time(),
                    })
                }
                res.json({
                    code: 200,
                    msg: "登录成功",
                    id: json.id,
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
                msg: "服务内部错误",
                error: String(e),
                timestamp: time(),
            });
        }
    }
})

app.get("/api/user/gettoken", async (req, res) => {
    requestLog(req);
    const {
        id,
        password
    } = req.query;
    if ((id || id == 0) && password) {
        const user = new User();
        try {
            const json = await user.getToken(id, decodeURIComponent(password));
            if (json.code == 200) {
                if (!json.fields[0]) {
                    res.status(400).json({
                        code: 401,
                        msg: "账号或密码错误",
                        timestamp: time(),
                    });
                }
                res.json({
                    code: 200,
                    msg: "获取成功",
                    timestamp: time(),
                    token: json.fields[0].token || null,
                })
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({
                code: 500,
                msg: "服务内部错误",
                error: String(e),
                timestamp: time(),
            })
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少参数",
            timestamp: time(),
        });
    }
})

app.get("/api/user/updatetoken", async (req, res) => {
    requestLog(req);
    const {
        id,
        password
    } = req.query;
    if ((id || id == 0) && password) {
        const user = new User();
        try {
            const json = await user.updateToken(id, decodeURIComponent(password));
            if (json.code == 200) {
                res.json({
                    code: 200,
                    msg: "更新成功",
                    timestamp: time(),
                })
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({
                code: 500,
                msg: "服务内部错误",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少参数",
            timestamp: time(),
        });
    }
})

app.get("/api/user/loginbytoken", async (req, res) => {
    requestLog(req);
    const {
        token
    } = req.query;
    if (token) {
        const user = new User();
        try {
            const json = await user.loginByToken(token);
            if (json.code == 200) {
                if (!json.fields[0]) {
                    res.json({
                        code: 401,
                        msg: "token错误",
                        timestamp: time(),
                    });
                }
                const data = json.fields[0];
                res.json({
                    code: 200,
                    msg: "登录成功",
                    data: {
                        ID: data.ID,
                        username: String(data.昵称),
                        avatar: data.头像,
                        VC: data.V币,
                        email: data.邮箱,
                        VIP: !!data.VIP,
                        signed: data.签到 || 0,
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
                    timestamp: time(),
                });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({
                code: 500,
                msg: "服务内部错误",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少token参数",
            timestamp: time(),
        });
    }
});

app.get("/api/participle", async (req, res) => {
    const {
        text
    } = req.query;
    console.log(text);
    const segment = new Segment();
    segment.useDefault();
    try {
        const words = segment.doSegment(text);
        console.log(words);
        res.json({
            code: 200,
            msg: "分词成功",
            data: words,
            timestamp: time(),
        });
    } catch (error) {
        console.error('分词过程中出错:', error.message);
        res.status(500).json({
            code: 500,
            msg: "分词过程中出错",
            error: error.message,
            timestamp: time(),
        });
    }
});

app.get("/api/query-game-server", async (req, res) => {
    requestLog(req);
    const {
        type,
        host,
        port
    } = req.query;
    if (!type && !host) {
        res.status(400).json({
            code: 400,
            msg: "请求参数错误(type、host)",
            timestamp: time(),
        });
        res.end();
    }
    try {
        const result = await GameDig.query({
            type: type,
            host: host,
            port: port,
            givenPortOnly: true
        })
        if (result.error) {
            res.json({
                code: 400,
                msg: "查询失败",
                error: result.error,
                timestamp: time(),
            });
            res.end();
        }
        console.log(result);
        res.json({
            code: 200,
            msg: "查询成功",
            data: result,
            timestamp: time(),
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            code: 500,
            msg: "内部服务错误",
            error: String(e),
            timestamp: time(),
        });
    }
})

app.get("/api/code", (req, res) => {
    const {
        code
    } = req.query;
    const newCode = Number(code);
    if (isNaN(newCode)) res.status(500).json({});
    res.status(newCode).json({
        code: code,
        msg: "请求成功",
        timestamp: time(),
    });
})

app.get("/api/book/random", async (req, res) => {
    requestLog(req);
    const {
        num
    } = req.query;
    try {
        const books = new Books();
        const json = await books.randomBook(num || 10);
        if (json.code == 200) {
            const data = []
            for (let i = 0; i < json.fields.length; i++) {
                data.push({
                    ID: json.fields[i].ID,
                    name: String(json.fields[i].书名),
                    bookID: json.fields[i].书ID,
                    author: String(json.fields[i].作者),
                    description: String(json.fields[i].介绍),
                    cover: String(json.fields[i].封面),
                    sign: json.fields[i].签约 == 1,
                    VIP: json.fields[i].VIP == 1,
                    createdAt: json.fields[i].createdAt,
                    updatedAt: json.fields[i].updatedAt,
                })
            }
            res.json({
                code: json.code,
                msg: `随机获取最多${num || 10}本图书成功`,
                data: data,
                total: json.count,
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
            msg: "服务内部错误",
            error: String(e),
            timestamp: time(),
        });
    }
})

app.get("/api/ykl/chat", async (req, res) => {
    res.json({
        code: 200,
        msg: "服务已关闭",
        timestamp: time(),
    });
    return;
    // 由于API已关闭，暂时不提供此接口
    requestLog(req);
    try {
        const {
            chatId
        } = req.query;
        const response = await fetch(`http://qq.catfun.top/chat.php`, {
            method: "GET",
            verbose: true
        });
        if (response.ok) {
            const data = await response.json();
            console.log("API请求成功", JSON.parse(JSON.stringify(data.filter(item => item.avatar != 0).filter(item => item.avatar == chatId), ["username", "message", "timestamp"], 4)));
            res.json({
                code: 200,
                msg: "请求成功",
                chatId: Number(chatId) || 906833900,
                data: JSON.parse(JSON.stringify(data.filter(item => item.avatar != 0).filter(item => item.avatar == chatId), ["username", "message", "timestamp"], 4)),
                timestamp: time(),
            });
        } else {
            console.error("API请求失败");
            res.status(400).json({
                code: 400,
                msg: "请求失败",
                timestamp: time(),
            })
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            code: 500,
            msg: "服务内部错误",
            error: String(e),
            timestamp: time(),
        });
    }
})

app.get("/api/user/search", async (req, res) => {
    requestLog(req);
    const {
        keyword
    } = req.query;
    const user = new User();
    try {
        const json = await user.search(decodeURIComponent(keyword || ""));
        if (json.code == 200) {
            const data = [];
            json.fields.forEach((item) => {
                data.push({
                    ID: item.ID,
                    username: String(item.昵称),
                    avatar: item.头像,
                    VC: item.V币,
                    email: item.邮箱,
                    VIP: !!item.VIP,
                    signed: item.签到,
                    op: item.管理员 == 1,
                    freezed: item.封号 == 1,
                    title: item.头衔,
                    titleColor: item.头衔色,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                })
            })
            res.json({
                code: 200,
                msg: "请求成功",
                keyword: !!keyword ? decodeURIComponent(keyword) : null,
                data: data,
                count: data.length,
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
            msg: String(e),
            timestamp: time(),
        });
    }
})

app.get("/api/noob/works", async (req, res) => {
    requestLog(req);
    const {
        id,
        password
    } = req.query;
    if ((id || id == 0) && password) {
        const noob = new NOOB();
        try {
            const json = await noob.getWorks(id, decodeURIComponent(password));
            if (json.code == 200) {
                const data = [];
                json.fields.forEach((item) => {
                    data.push({
                        ID: item.ID,
                        name: String(item.作品名),
                        workId: item.作品ID,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                    })
                })
                res.json({
                    code: 200,
                    msg: "请求成功",
                    timestamp: time(),
                    data: data,
                })
            } else {
                res.status(json.code).json({
                    code: json.code,
                    msg: json.msg,
                    error: json.error,
                    timestamp: time(),
                })
            }
        } catch (e) {
            res.status(500).json({
                code: 500,
                msg: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "请求参数错误",
            timestamp: time(),
        });
    }
})

app.get("/api/noob/save", async (req, res) => {
    requestLog(req);
    const {
        ID,
        password,
        file,
        nid
    } = req.query;
    if (!(ID || ID == 0) || !password || !file || !nid) {
        res.status(400).json({
            code: 400,
            msg: "请求参数错误",
            timestamp: time(),
        });
    }
    try {
        const user = new User();
        const noob = new NOOB();
        const j = await user.login(ID, decodeURIComponent(password));
        if (j.code == 200) {
            const d = j.fields[0];
            if (!d) {
                res.status(401).json({
                    code: 401,
                    msg: "鉴权失败",
                    timestamp: time(),
                });
                return;
            }
            if (d.封号 == 1) {
                res.status(403).json({
                    code: 403,
                    msg: "用户被封禁",
                    timestamp: time(),
                });
                return;
            }
            if (nid == "new") {
                const json = await noob.newWork(ID, file);
                if (json.json.code != 200) {
                    res.status(json.json.code).json({
                        code: json.json.code,
                        msg: json.json.msg,
                        timestamp: time(),
                    });
                    return;
                }
                res.status(200).json({
                    code: 200,
                    msg: "保存成功",
                    nid: json.nid,
                    timestamp: time(),
                });
                return;
            } else {
                const json = await noob.getByNID(nid);
                if (json.code == 200) {
                    const data = json.fields[0];
                    if (!data) {
                        res.status(404).json({
                            code: 404,
                            msg: "未找到该作品",
                            timestamp: time(),
                        });
                        return;
                    }
                    const json2 = await noob.update(ID, nid, file);
                    if (json2.code != 200) {
                        res.status(json2.code).json({
                            code: json2.code,
                            msg: json2.msg,
                            timestamp: time(),
                        });
                        return;
                    }
                    res.json({
                        code: 200,
                        msg: "保存成功",
                        timestamp: time(),
                    });
                } else {
                    res.status(json.code).json({
                        code: json.code,
                        msg: json.msg,
                        timestamp: time(),
                    });
                    return;
                }
            }
        } else {
            res.status(j.code).json({
                code: j.code,
                msg: j.msg,
                timestamp: time(),
            });
            return;
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
})

app.get("/api/noob/get", async (req, res) => {
    requestLog(req);
    const { ID, password, nid } = req.query;
    try {
        if (!ID || !password || !nid) {
            res.status(400).json({
                code: 400,
                msg: "参数错误",
                timestamp: time(),
            });
            return;
        }
        const user = new User();
        const j = await user.login(ID, decodeURIComponent(password));
        if (j.code != 200) {
            res.status(j.code).json({
                code: j.code,
                msg: j.msg,
                timestamp: time(),
            });
            return;
        }
        const d = j.fields[0];
        if (!d) {
            res.status(404).json({
                code: 401,
                msg: "鉴权失败",
                timestamp: time(),
            });
            return;
        }
        const noob = new NOOB();
        const json = await noob.getByNID(nid);
        if (json.code != 200) {
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
                msg: "未找到该作品",
                timestamp: time(),
            });
            return;
        }
        if (data.ID != ID) {
            res.status(403).json({
                code: 403,
                msg: "无权限访问",
                timestamp: time(),
            });
            return;
        }
        res.status(200).json({
            code: 200,
            msg: "获取成功",
            data: {
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                url: data.作品数据,
                nid: data.作品ID,
            },
            timestamp: time(),
        });
    } catch (e) {
        res.status(500).json({
            code: 500,
            msg: "服务器错误",
            error: e.message,
            timestamp: time(),
        });
    }
})

app.get("/api/noob/publish", async (req, res) => {
    requestLog(req);
    const { nid, ID, password } = req.query;
    if (!nid || !ID || !password) {
        res.status(400).json({
            code: 400,
            msg: "缺少参数",
            timestamp: time(),
        });
        return;
    }
    const user = new User();
    const noob = new NOOB();
    try {
        const j = await user.login(ID, decodeURIComponent(password));
        if (j.code != 200) {
            res.status(j.code).json({
                code: j.code,
                msg: j.msg,
                timestamp: time(),
            })
            return;
        }
        if (!j.fields[0]) {
            res.status(401).json({
                code: 401,
                msg: "账号或密码错误",
                timestamp: time(),
            });
            return;
        }
        const json = await noob.publish(ID, nid);
        if (json.code != 200) {
            res.status(json.code).json({
                code: json.code,
                msg: json.msg,
                timestamp: time(),
            });
        }
        res.json({
            code: 200,
            msg: "发布成功",
            timestamp: time(),
        })
    } catch (e) {
        res.status(500).json({
            code: 500,
            msg: "服务器错误",
            error: e.message,
            timestamp: time(),
        });
    }
})

app.get("/api/book/updatebook", async (req, res) => {
    requestLog(req);
    const {
        type,
        id,
        data
    } = req.query;
    if (type && (id || id == 0) && data) {
        const books = new Books();
        try {
            const json = await books.updateBook(type, id, decodeURIComponent(data));
            if (json.code == 200) {
                res.json({
                    code: 200,
                    msg: "更新成功",
                    timestamp: time(),
                })
            } else {
                res.status(json.code).json({
                    code: json.code,
                    msg: json.msg,
                    timestamp: time(),
                })
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
            msg: "缺少type、id、data参数",
            timestamp: time(),
        });
    }
})

app.get("/api/book/addchapter", async (req, res) => {
    requestLog(req);
    const {
        id,
        bookid,
        num,
        name,
        content
    } = req.query;
    if (num < 1) {
        res.status(400).json({
            code: 400,
            msg: "num必须大于0",
            timestamp: time(),
        });
    }
    console.log(typeof Number(id));
    if (Number.isNaN(Number(id)) || Number.isNaN(Number(bookid)) || Number.isNaN(Number(num))) {
        res.status(400).json({
            code: 400,
            msg: "id或bookid或num参数类型错误，必须为数值类型",
            timestamp: time(),
        });
    }
    if ((id || id == 0) && (bookid || bookid == 0) && num && name && content) {
        const books = new Books();
        try {
            const json = await books.addChapter(id, bookid, num, decodeURIComponent(name), decodeURIComponent(content));
            if (json.code == 200) {
                res.json({
                    code: 200,
                    msg: "添加成功",
                    timestamp: time(),
                })
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
                msg: "服务内部错误，请联系官方(QQ:3164417130)",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少id、bookid、num、name、content参数",
            timestamp: time(),
        });
    }
})

app.get("/api/book/addbook", async (req, res) => {
    requestLog(req);
    const {
        name,
        id,
        description,
        cover,
        author
    } = req.query;
    if (name && (id || id == 0) && description && cover && author) {
        const books = new Books();
        try {
            const json = await books.addBook(decodeURIComponent(name), decodeURIComponent(id), decodeURIComponent(author), decodeURIComponent(description), decodeURIComponent(cover));
            if (json.code == 200) {
                res.json({
                    code: 200,
                    msg: "添加成功",
                    timestamp: time(),
                })
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
                msg: "服务内部错误，请联系官方(QQ:3164417130)",
                error: String(e),
                timestamp: time(),
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            msg: "缺少name、id、description、cover、author参数",
            timestamp: time(),
        });
    }
})

app.get("/api/book/chapters", async (req, res) => {
    requestLog(req);
    const {
        id
    } = req.query;
    console.log(typeof Number(id));
    if (Number.isNaN(Number(id))) {
        res.status(400).json({
            code: 400,
            msg: "id参数类型错误，必须为数值类型",
            timestamp: time(),
        });
    }
    if (id || id == 0) {
        const books = new Books();
        try {
            const json = await books.getChapters(id);
            if (json.code == 200) {
                if (json.fields.length == 0) {
                    res.status(404).json({
                        code: 404,
                        msg: "图书不存在章节",
                        timestamp: time(),
                    });
                }
                const data = []
                json.fields.forEach(field => {
                    data.push({
                        ID: field.ID,
                        name: String(field.章节名),
                        content: String(field.章节内容),
                        num: field.章节编号,
                        createdAt: field.createdAt,
                        updatedAt: field.updatedAt
                    })
                });
                res.json({
                    code: 200,
                    msg: "获取成功",
                    data: data,
                    bookID: Number(id),
                    timestamp: time(),
                })
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
})

app.get("/api/book/search", async (req, res) => {
    requestLog(req);
    const {
        keyword
    } = req.query;
    const books = new Books();
    try {
        const json = await books.search(decodeURIComponent(keyword ? keyword : ""));
        if (json.code == 200) {
            const data = []
            json.fields.forEach(field => {
                data.push({
                    ID: field.ID,
                    bookID: field.书ID,
                    name: String(field.书名),
                    author: String(field.作者),
                    cover: String(field.封面),
                    description: String(field.介绍),
                    sign: field.签约 == 1,
                    VIP: field.VIP == 1,
                    createdAt: field.createdAt,
                    updatedAt: field.updatedAt
                })
            });
            res.json({
                code: 200,
                msg: "搜索成功",
                data: data,
                timestamp: time(),
            })
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
            msg: "服务内部错误，请联系官方(QQ:3164417130)",
            error: String(e),
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
        runtimestamp: Date.now() - startTime,
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
    const {
        email,
        ID,
        password
    } = req.query;
    console.log(Number(ID));
    if (Number.isNaN(Number(ID))) {
        res.status(400).json({
            code: 400,
            msg: "id参数类型错误，必须为数值类型",
            timestamp: time(),
        });
        return;
    }
    if (email || (ID || ID == 0) || password) {
        const UUID_db = new UUIDdb();
        try {
            const json = await UUID_db.addData(uuid, "resetpassword", ID, decodeURIComponent(password));
            if (json.code == 200) {
                const url = `https://iftc.koyeb.app/api/user/resetpassword/${uuid}`
                const json2 = await UUID_db.sendEmail(decodeURIComponent(email), "重置密码", `<!DOCTYPE html>
                    <html lang="zh-CN">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>重置密码</title>
                    </head>
                    <body>
                    <div>您好，您正在重置密码，还差最后一步，请访问 <a href="${url}">${url}</a> 完成密码重置</div>
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
    const {
        uuid
    } = req.params;
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
    const {
        email,
        code
    } = req.query;
    console.log(email, code);
    if (email && code) {
        const user = new User();
        try {
            const json = await user.verifyCode(decodeURIComponent(email), code);
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
    const {
        email,
        title,
        content
    } = req.query;
    console.log(email, title, content);
    if (email && title && content) {
        const user = new User();
        try {
            const json = await user.sendCode(decodeURIComponent(email), decodeURIComponent(title), decodeURIComponent(content));
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
    const {
        type,
        id,
        password,
        data
    } = req.query;
    console.log(typeof Number(id));
    if (Number.isNaN(Number(id))) {
        res.status(400).json({
            code: 400,
            msg: "id参数类型错误，必须为数值类型",
            timestamp: time(),
        });
    }
    if (id != 0 && type == "nickname" && decodeURIComponent(data).includes("#")) {
        res.status(400).json({
            code: 400,
            msg: "昵称不能包含#字符",
            timestamp: time(),
        });
        return;
    }
    if (id != 0 && type == "password" && decodeURIComponent(data).includes("#")) {
        res.status(400).json({
            code: 400,
            msg: "密码不能包含#字符",
            timestamp: time(),
        });
        return;
    }
    if (type && (id || id == 0) && password && data) {
        const user = new User();
        try {
            const json = await user.update(type, id, decodeURIComponent(password), decodeURIComponent(data));
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
    const {
        nickname,
        avatar,
        email,
        password
    } = req.query;
    if (nickname && email && password) {
        const user = new User();
        try {
            const json = await user.register(decodeURIComponent(email), decodeURIComponent(password), decodeURIComponent(nickname), decodeURIComponent(avatar) ? decodeURIComponent(avatar) : "https://iftc.koyeb.app/static/avatar.png");
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
    const {
        user,
        password
    } = req.query;
    console.log(user, password);
    if ((user || user == 0) && password) {
        const auser = new User();
        try {
            const json = await auser.login(decodeURIComponent(user), decodeURIComponent(password));
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
    const {
        id
    } = req.query;
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
                        signed: data.签到 || 0,
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

app.get('/api/qrcode', async (req, res) => {
    requestLog(req);
    const data = req.query.data;
    const type = req.query.type || 'png';
    if (!data) {
        res.status(400).json({
            code: 400,
            msg: "缺少data参数",
            timestamp: time(),
        });
    }
    try {
        if (type == "svg") {
            const qrcode = new QRCodeSvg({
                content: data,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                ecLevel: 'H',
            });
            const svg = qrcode.svg();
            console.log(typeof svg, svg);
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(svg);
        } else {
            const qrBuffer = await QRCode.toBuffer(data, {
                type: "png",
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'H',
            });
            res.setHeader('Content-Type', type == 'svg' ? 'image/svg+xml' : 'image/png');
            res.setHeader('Content-Length', qrBuffer.length);
            res.send(qrBuffer);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '生成二维码失败',
            error: err.message,
            timestamp: time()
        });
    }
});

app.get("/api/book/getbyid", async (req, res) => {
    requestLog(req);
    const {
        id,
        page = 1,
    } = req.query;
    if (!id) {
        res.status(400).json({
            code: 400,
            msg: '缺少参数',
            timestamp: time()
        });
        return;
    }
    console.log(typeof Number(id));
    if (Number.isNaN(Number(id))) {
        res.status(400).json({
            code: 400,
            msg: '参数错误',
            timestamp: time()
        });
        return;
    }
    const books = new Books();
    try {
        const json = await books.getById(id, page);
        const fields = json.fields;
        const data = [];
        fields.forEach((item) => {
            data.push({
                bookID: item.书ID,
                name: String(item.书名),
                cover: String(item.封面),
                author: String(item.作者),
                description: String(item.介绍),
                signed: item.签约 == 1,
                VIP: item.VIP == 1,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })
        });
        res.json({
            code: 200,
            msg: '获取成功',
            data: data,
            ID: Number(id),
            timestamp: time()
        });
        console.log(json);
    } catch (e) {
        res.status(500).json({
            code: 500,
            msg: '服务器错误',
            error: e.message,
            timestamp: time()
        });
    }
});

app.listen(port, () => {
    startTime = Date.now();
    console.log(`服务器已在端口 ${port} 开启`);
});

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
    return `${String(h).padStart(2,
        '0')}时${String(m).padStart(2,
            '0')}分${String(s).padStart(2,
                '0')}秒${String(ms).padStart(3,
                    '0')}毫秒`;
}

async function mixed(filepath, params) {
    try {
        let content = await fs.readFile(filepath,
            "utf-8");
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
    addRequestCount();
    if (!(
        req.url.startsWith("/api/user/login") ||
        req.url.startsWith("/api/user/register") ||
        req.url.startsWith("/api/sendcode") ||
        req.url.startsWith("/api/verifycode") ||
        req.url.startsWith("/api/user/resetpassword") ||
        req.url.startsWith("/api/loginbytoken") ||
        req.url.startsWith("/api/updatetoken") ||
        req.url.startsWith("/api/gettoken")
    )) {
        ips.unshift({
            ip: req.headers["x-forwarded-for"],
            url: req.url,
            method: req.method,
            headers: req.headers,
            body: req.body,
            time: new Date(time() + 2880000).toLocaleString(),
        })
    }

    console.log(`收到请求 IP: ${req.ip}或${req.headers["x-fowarded-for"]} IPs: ${req.ips} UA: ${req.headers["user-agent"]}`)
    console.log(`请求源：${req.headers["referer"]}`)
    console.log(`Method: ${req.method} URL: ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);

}

setInterval(() => {
    const time = new Date().toLocaleString();
    console.log("服务器正在运行中...", time);
}, 30000);

const twapi = 'https://tinywebdb.appinventor.space/api?user=stree&secret=7e59b282';

async function addRequestCount() {
    const requestCount = await getRequestCount();
    const url = twapi + '&action=update&tag=iftc.koyeb.app&value=' + (requestCount + 1);
    console.log(url);
    const resp = await fetch(url);
    const json = await resp.json();
    console.log(json);
}

async function getRequestCount() {
    const url = twapi + '&action=get&tag=iftc.koyeb.app';
    console.log(url);
    const resp = await fetch(url);
    const json = await resp.json();
    const count = json['iftc.koyeb.app'];
    return count == 'null' ? 0 : Number(count);
}

function timestampToDate(timestamp) {
    const time = new Date(timestamp + 2880000 - 7200000);
    return time.toLocaleString()
}

async function getAIAPIKey() {
    const url = twapi + '&action=get&tag=openrouter';
    console.log(url);
    const resp = await fetch(url);
    const json = await resp.json();
    return json['openrouter'];
}

async function checkProhibitedWords(text) {
    const prohibitedWords = await fs.readFile('Prohibited_words.json', 'utf8');
    const prohibitedWordsList = JSON.parse(prohibitedWords).words.split("\n");
    console.log(prohibitedWordsList);
    return false;
    for (const word of prohibitedWordsList) {
        if (text.includes(word)) {
            console.log(word)
            return true;
        }
    }
}

async function randomUsername() {
    const wordds = await fs.readFile("Random_username.json", "utf-8");
    const words = JSON.parse(wordds);
    const adjs = words.adj;
    const nouns = words.noun;
    const adj = adjs[Math.floor(Math.random() * adjs.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const id = (btoa((Math.random() * (10 ** 16)).toString(36))).slice(0, 4);
    return adj + noun + id;
}


new Other(app, requestLog);