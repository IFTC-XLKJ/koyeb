import Fastify from "fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import os from "os";
import si from "systeminformation";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import Sign from "./Sign.ts";

const sign: Sign = new Sign();

console.log(">>> Server starting, __dirname is:", path.dirname(fileURLToPath(import.meta.url)));

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const fastify: FastifyInstance = Fastify({
    logger: false,
});

const port: number = Number(process.env.PORT) || 8000;
const backendPass: string = "21ec360b05962410edbcc561edc8648e";
const requestCounts = new Map();
const crawlerAgents = [
    "slurp",
    "duckduckbot",
    "baiduspider",
    "facebookexternalhit",
    "twitterbot",
    "rogerbot",
    "python",
    "urllib",
    "requests",
    "httpclient",
    "go-http-client",
    "java",
    "curl",
    "wget",
    "axios",
    "node-fetch",
    "scrapy",
    "apify",
    "puppeteer",
    "playwright",
    "selenium",
];

function time(): number {
    return Date.now();
}

async function mixed(filepath: string, params: Record<string, any>): Promise<string> {
    try {
        let content: string = await fs.readFile(filepath, "utf-8");
        const keys = Object.keys(params);
        keys.forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, "g");
            content = content.replace(regex, params[key]);
        });
        return content;
    } catch (error) {
        throw error;
    }
}

function isSuspiciousBehavior(req: FastifyRequest): boolean {
    const hasBrowserHeaders: boolean =
        !!req.headers.accept &&
        !!req.headers["accept-language"] &&
        !!req.headers["accept-encoding"];
    const hasReferer: boolean = !!req.headers.referer;
    const connectionType: string | undefined = req.headers.connection;
    if (!hasBrowserHeaders && connectionType === "close") return true;
    return false;
}

async function isRateLimited(ip: string | string[]): Promise<boolean> {
    const now: number = Date.now();
    const windowMs: number = 60000;
    const maxRequests: number = 100;
    if (!requestCounts.has(ip)) requestCounts.set(ip, []);
    const requests: number[] = requestCounts.get(ip);
    const recentRequests: number[] = requests.filter((time: number) => now - time < windowMs);
    if (recentRequests.length >= maxRequests) return true;
    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    return false;
}

function requestLog(req: FastifyRequest): void {
    if (req.headers["user-agent"] == "Koyeb Health Check") return;
    if (req.headers["user-agent"] == "IFTC Bot") return console.log("状态检测请求");
    requestRecord(req);
    console.log(
        `收到请求 IP: ${req.ip}或${req.headers["x-forwarded-for"]} IPs: ${req.ips} UA: ${req.headers["user-agent"]}`,
    );
    console.log(`请求源：${req.headers["referer"] || "Unknown"}`);
    console.log(`Method: ${req.method} URL: ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
}

async function getCpuUsageSI(): Promise<string> {
    const data: si.Systeminformation.CurrentLoadData = await si.currentLoad();
    let cpuUsage: number = 0;
    data.cpus.forEach((cpu: si.Systeminformation.CurrentLoadCpuData) => {
        cpuUsage += cpu.load;
    });
    cpuUsage = cpuUsage / data.cpus.length;
    return cpuUsage.toFixed(2);
}

async function systemMonitor(): Promise<void> {
    console.log("=== ↓系统监控↓ ===");
    console.log(`操作系统: ${os.type()} ${os.release()}`);
    console.log(`CPU 架构: ${os.arch()}`);
    console.log(`CPU 核心数: ${os.cpus().length}`);
    console.log(`CPU 型号: ${os.cpus()[0].model}`);
    console.log(`CPU 利用率: ${await getCpuUsageSI()}%`);
    console.log(`总内存: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`);
    console.log(`已使用内存: ${((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)} MB`);
    console.log(
        `内存使用率: ${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%`,
    );
    console.log(`可用内存: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB`);
    console.log(`系统运行时间: ${(os.uptime() / 60 / 60).toFixed(2)} 小时`);
    console.log("=== ↑系统监控↑ ===");
}

async function requestRecord(req: FastifyRequest): Promise<void> {
    const url: URL = new URL(req.url, `https://${req.headers.host}`);
    const key: string =
        "LkduYVIN+ZWKJTI7vTH1UH1AA2z6ZrlHk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOj8bHkmeZm8+aIa5EOQG+kD6KVpdn29kjtD3zNoB+BTgH1Ykwr1CKqPo15DuJZVFC0=";
    const timestamp: number = Date.now();
    const signaturePromise: Promise<string> = sign.get(String(timestamp));
    const signature: string = await signaturePromise;
    const ip: string | string[] = req.headers["x-forwarded-for"] || req.ip;
    const r: Response = await fetch(`https://api.pgaot.com/dbs/cloud/set_table_data`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Pgaot-Key": key,
            "X-Pgaot-Sign": signature,
            "X-Pgaot-Time": timestamp.toString(),
        },
        body: JSON.stringify({
            type: "INSERT",
            filter: `IP,站点,UA`,
            fields: `("${ip}", "${decodeURIComponent(new URL(url.pathname, "iftc://main/").toString() || "Unknown")}", "${req.headers["user-agent"] || "Unknown"}")`,
        }),
    });
    const json: Record<string, any> = await r.json();
    console.log("IP记录结果:", json);
}

async function start() {
    console.log(">>> [STEP 1] Start function entered");
    try {
        const staticPath = path.join(__dirname, "static");
        const filePath = path.join(__dirname, "file");
        await fs.mkdir(staticPath, { recursive: true });
        await fs.mkdir(filePath, { recursive: true });
        console.log(">>> [STEP 2] Registering static plugins...");
        await fastify.register(fastifyStatic, {
            root: staticPath,
            prefix: "/static/",
        });
        await fastify.register(fastifyStatic, {
            root: filePath,
            prefix: "/file/",
            decorateReply: false,
        });
        console.log(">>> [STEP 3] Static plugins registered.");
        console.log(">>> [STEP 4] Adding hooks...");
        fastify.addHook(
            "onRequest",
            async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                if (request.url.endsWith("php"))
                    return reply.status(403).send({
                        code: 403,
                        msg: "PHP你妈呢",
                        timestamp: time(),
                    });
            },
        );
        fastify.addHook(
            "onRequest",
            async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                if (request.headers["user-agent"] == "Koyeb Health Check") return;
                if (request.headers["X-PASS"] == backendPass) return;
                if (request.headers["user-agent"] == null)
                    return reply.status(400).send({ code: 400, msg: "", timestamp: time() });
                const ua: string = (request.headers["user-agent"] || "").toLowerCase();
                const ip: string | string[] = request.headers["x-forwarded-for"] || request.ip;
                if (crawlerAgents.some((agent: string) => ua.includes(agent)))
                    return reply
                        .status(403)
                        .send({ code: 403, msg: "爬你妈呢", timestamp: time() });
                if (isSuspiciousBehavior(request))
                    return reply
                        .status(403)
                        .send({ code: 403, msg: "可疑请求行为", timestamp: time() });
                if (await isRateLimited(ip))
                    return reply
                        .status(429)
                        .send({ code: 429, msg: "请求过于频繁", timestamp: time() });
            },
        );
        fastify.addHook(
            "onRequest",
            async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                if (request.headers["user-agent"] == "Koyeb Health Check") return;
                if (request.headers["user-agent"] == "IFTC Bot") return;
                console.log("Cookies:", request.headers.cookie);
                requestLog(request);
            },
        );
        console.log(">>> [STEP 5] Hooks added.");
        console.log(">>> [STEP 6] Adding routes...");
        fastify.setNotFoundHandler(
            async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                reply.status(404).send({
                    code: 404,
                    msg: `Route ${request.method} ${request.url} not found`,
                    error: "Not Found",
                    timestamp: time(),
                });
            },
        );
        fastify.get("/", async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
            if (
                request.headers["user-agent"] == "Koyeb Health Check" ||
                request.headers["user-agent"] == "IFTC Bot"
            )
                return reply.send({ code: 200, msg: "请求成功", timestamp: time() });
            const params: Record<string, any> = {};
            reply.headers({ "Content-Type": "text/html; charset=utf-8" });
            try {
                const content: string = await mixed("pages/index.html", params);
                if (typeof content !== "string") throw new Error("Invalid content type");
                return reply.send(content);
            } catch (e: unknown) {
                console.error(e);
                return reply.send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (e as Error).message || "Internal Server Error",
                    timestamp: time(),
                });
            }
        });
        fastify.get(
            "/api",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const apis: string[] = [
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
                ];
                return {
                    code: 200,
                    msg: "请求成功",
                    copyright: "IFTC",
                    origin:
                        request.headers["referer"] || request.headers["x-forwarded-for"] || null,
                    apis: apis,
                    doc: "https://iftc-api.apifox.cn",
                    count: apis.length,
                    timestamp: time(),
                    Apifox:
                        request.headers["User-Agent"] == "Apifox/1.0.0 (https://apifox.com)"
                            ? true
                            : void 0,
                };
            },
        );
        fastify.get(
            "/apidoc",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                return reply.redirect("https://iftc-api.apifox.cn");
            },
        );
        console.log(">>> [STEP 7] Routes added.");
        console.log(">>> [STEP 8] Starting listener...");
        await fastify.listen({ port: port, host: "0.0.0.0" });
        console.log(`Server listening at http://0.0.0.0:${port}`);
    } catch (err) {
        console.error("!!! FATAL ERROR in start():", err);
        if (err instanceof Error) console.error("Stack:", err.stack);
        process.exit(1);
    }
}
start();

process.on("unhandledRejection", (reason, promise) => {
    console.error("!!! Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("!!! Uncaught Exception:", err);
    process.exit(1);
});

setInterval(async (): Promise<void> => {
    try {
        await systemMonitor();
        const r: Response = await fetch("https://iftc.deno.dev");
        console.log(await r.text());
    } catch (e) {
        console.error("Monitor error:", e);
    }
}, 30000);

setInterval((): void => {
    const timeStr: string = new Date().toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });
    console.log("服务器正在运行中...", timeStr);
}, 30000);
