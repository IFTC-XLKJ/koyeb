import Fastify from "fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import os from "os";
import si from "systeminformation";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import { sign } from "./shared.ts";
import API, { authTempTokens } from "./API.ts";
import TGBot from "./tgbot.ts";
import multipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import { Readable } from "stream";
import { exec } from "child_process";
import UUID_db from "./UUID_db.ts";
import User from "./User.ts";
import { sendMail } from "./Mail.ts";

exec("iperf3 -s");

const uuid_db = new UUID_db();
const user = new User();

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);
console.log(">>> Server starting, __dirname is:", __dirname);

const fastify: FastifyInstance = Fastify({
    logger: false,
});

const port: number = Number(process.env.PORT) || 8000;
const backendPass: string = "21ec360b05962410edbcc561edc8648e";
const requestCounts = new Map<string, number[]>();
const bannedIPs = new Map<string, number>();
const violationCounts = new Map<string, { count: number; firstAt: number }>();
const crawlerAgents = new Set([
    "slurp",
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
    "mj12bot",
    "ahrefsbot",
    "semrushbot",
    "sogou",
    "exabot",
    "dotbot",
    "bytespider",
    "gptbot",
    "chatgpt-user",
    "ccbot",
    "amazonbot",
    "meta-externalagent",
    "claudebot",
    "anthropic-ai",
    "perplexitybot",
    "timpibot",
    "seekportbot",
    "petalbot",
    "sistrixcrawler",
    "dataforseo",
    "serpstatbot",
    "serpbot",
    "blexbot",
    "turnitin",
    "paperli",
    "feedly",
    "rssbot",
    "friendfeedbot",
    "bitlybot",
    "nutch",
    "htdig",
    "grouphigh",
    "scrapbot",
    "mechanize",
    "htmlunit",
    "ghost",
    "phantomjs",
    "slimerjs",
    "cypress",
    "nightwatch",
    "webdriver",
    "headlesschrome",
    "lighthouse",
]);
const uaSubstrings = [
    "spider",
    "crawl",
    "fetch",
    "scrape",
    "harvest",
    "headless",
    "phantom",
    "selenium",
    "webdriver",
    "automation",
    "httpclient",
    "python-requests",
    "python-urllib",
    "python/",
    "java/",
    "go-http",
    "php/",
    "ruby/",
    "perl/",
    "curl/",
    "wget/",
    "libwww",
    "lwp-trivial",
    "scrapy",
    "httplib",
    "aiohttp",
    "httpx/",
    "node-fetch",
    "axios/",
    "undici/",
    "got/",
    "request/",
    "urllib3",
    "mechanize",
    "htmlunit",
];
const blockedPaths = [
    "/wp-admin",
    "/wp-login",
    "/xmlrpc.php",
    "/.env",
    "/.git",
    "/config.php",
    "/phpmyadmin",
    "/admin",
    "/backup",
    "/cgi-bin",
    "/scripts",
    "/_debug",
    "/telescope",
    "/horizon",
    "/.svn",
    "/.hg",
    "/wp-content",
    "/wp-includes",
    "/administrator",
    "/joomla",
    "/drupal",
    "/magento",
    "/shopware",
    "/typo3",
];
const sensitiveEndpoints = [
    "/api/user/login",
    "/api/user/register",
    "/api/user/sendcode",
    "/api/user/gettoken",
    "/api/user/resetpassword",
];

function time(): number {
    return Date.now();
}

async function mixed(filepath: string, params: Record<string, any>): Promise<string> {
    let content: string = await fs.readFile(filepath, "utf-8");
    for (const [key, value] of Object.entries(params)) {
        content = content.replaceAll(`{{${key}}}`, String(value));
    }
    return content;
}

function isSuspiciousBehavior(req: FastifyRequest): boolean {
    const ua: string = (req.headers["user-agent"] || "").toLowerCase();
    const uaLength: number = (req.headers["user-agent"] || "").length;
    if (uaLength > 500) return true;
    const hasBrowserHeaders: boolean =
        !!req.headers.accept &&
        !!req.headers["accept-language"] &&
        !!req.headers["accept-encoding"];
    const hasSecFetch: boolean = !!req.headers["sec-fetch-dest"] || !!req.headers["sec-fetch-mode"];
    const hasBrowserUA: boolean =
        ua.includes("mozilla") ||
        ua.includes("chrome") ||
        ua.includes("firefox") ||
        ua.includes("safari");
    if (!hasBrowserHeaders && !hasBrowserUA) return true;
    if (!hasBrowserHeaders && !hasSecFetch && !hasBrowserUA) return true;
    return false;
}

function getIP(ip: string | string[]): string {
    return Array.isArray(ip) ? ip[0] : ip;
}

function isRateLimited(ip: string | string[], url: string): boolean {
    const now: number = Date.now();
    const windowMs: number = 30000;
    const isSensitive: boolean = sensitiveEndpoints.some((ep) => url.startsWith(ep));
    const maxRequests: number = isSensitive ? 20 : 100;
    const key: string = getIP(ip);
    if (!requestCounts.has(key)) requestCounts.set(key, []);
    const requests: number[] = requestCounts.get(key)!;
    const recentRequests: number[] = requests.filter((t: number) => now - t < windowMs);
    if (recentRequests.length >= maxRequests) return true;
    recentRequests.push(now);
    requestCounts.set(key, recentRequests);
    return false;
}

function isIPBanned(ip: string): boolean {
    const expires: number | undefined = bannedIPs.get(ip);
    if (!expires) return false;
    if (Date.now() > expires) {
        bannedIPs.delete(ip);
        return false;
    }
    return true;
}

function banIP(ip: string, durationMs: number): void {
    bannedIPs.set(ip, Date.now() + durationMs);
    console.log(`[BAN] IP ${ip} banned for ${durationMs / 1000}s`);
}

function recordViolation(ip: string): void {
    const now: number = Date.now();
    const windowMs: number = 300000; // 5 minutes
    let entry = violationCounts.get(ip);
    if (!entry || now - entry.firstAt > windowMs) {
        entry = { count: 1, firstAt: now };
    } else {
        entry.count++;
    }
    violationCounts.set(ip, entry);
    if (entry.count >= 10) {
        banIP(ip, 1800000); // 30 minutes
        violationCounts.delete(ip);
    } else if (entry.count >= 5) {
        banIP(ip, 300000); // 5 minutes
    }
}

// Periodic cleanup of stale rate limit entries, banned IPs, and violation counts
setInterval(() => {
    const now: number = Date.now();
    const windowMs: number = 60000;
    for (const [ip, timestamps] of requestCounts.entries()) {
        const recent = (timestamps as number[]).filter((t: number) => now - t < windowMs);
        if (recent.length === 0) {
            requestCounts.delete(ip);
        } else {
            requestCounts.set(ip, recent);
        }
    }
    for (const [ip, expires] of bannedIPs.entries()) {
        if (now > expires) bannedIPs.delete(ip);
    }
    for (const [ip, entry] of violationCounts.entries()) {
        if (now - entry.firstAt > 300000) violationCounts.delete(ip);
    }
}, 60000);

function requestLog(req: FastifyRequest): void {
    if (req.headers["user-agent"] == "Koyeb Health Check") return;
    if (req.headers["user-agent"] == "IFTC Bot") return console.log("状态检测请求");
    requestRecord(req);
    console.log(
        `收到请求 IP: ${req.ip} XFF: ${req.headers["x-forwarded-for"] || "-"} UA: ${req.headers["user-agent"]}`,
    );
    console.log(`请求源：${req.headers["referer"] || "Unknown"}`);
    console.log(`Method: ${req.method} URL: ${req.url}`);
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
    const signature: string = sign.get(String(timestamp));
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

async function returnPage(
    path: string,
    params: Record<string, any>,
    reply: FastifyReply,
): Promise<Object> {
    reply.headers({ "Content-Type": "text/html; charset=utf-8" });
    try {
        const content: string = await mixed(`pages/${path}`, params);
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
}

async function start() {
    console.log(">>> [STEP 1] Start function entered");
    try {
        const staticPath = path.join(__dirname, "static");
        const filePath = path.join(__dirname, "file");
        await fs.mkdir(staticPath, { recursive: true });
        await fs.mkdir(filePath, { recursive: true });
        console.log(">>> [STEP 2] Registering static plugins...");
        await fastify.register(fastifyCookie);
        await fastify.register(multipart);
        await fastify.register(fastifyStatic, {
            root: staticPath,
            prefix: "/static/",
        });
        await fastify.register(fastifyStatic, {
            root: filePath,
            prefix: "/file/",
            decorateReply: false,
        });
        await fastify.register(fastifyCors, {
            origin: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "X-PASS"],
            credentials: true,
        });
        console.log(">>> [STEP 3] Static plugins registered.");
        console.log(">>> [STEP 4] Adding hooks...");
        fastify.addHook(
            "onRequest",
            async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                requestLog(request);
                console.log(request.url, request.method, request.headers["user-agent"]);
                if (request.url.endsWith("php"))
                    return reply.status(403).send({
                        code: 403,
                        msg: "PHP你妈呢",
                        timestamp: time(),
                    });
                if (request.headers["user-agent"] == "Koyeb Health Check") return;
                if (request.headers["X-PASS"] == backendPass) return;
                if (request.headers["user-agent"] == null)
                    return reply.status(400).send({ code: 400, msg: "", timestamp: time() });
                const ua: string = (request.headers["user-agent"] || "").toLowerCase();
                const ip: string = getIP(request.headers["x-forwarded-for"] || request.ip);
                if (
                    ua == "IFTC Bot" ||
                    ua == "mini-tsc/1.0" ||
                    ua.includes("xaiimageapifetch/1.0")
                ) {
                    return;
                }
                if (ua.includes("apifox")) return;
                if (isIPBanned(ip))
                    return reply
                        .status(403)
                        .send({ code: 403, msg: "禁止访问", timestamp: time() });
                const urlPath: string = request.url.split("?")[0].toLowerCase();
                if (blockedPaths.some((p) => urlPath.startsWith(p)))
                    return reply.status(404).send({
                        code: 404,
                        msg: "Not Found",
                        timestamp: time(),
                    });
                for (const agent of crawlerAgents) {
                    if (ua.includes(agent)) {
                        recordViolation(ip);
                        console.log("Crawler agent detected:", request.url);
                        return reply
                            .status(403)
                            .send({ code: 403, msg: "爬你妈呢", timestamp: time() });
                    }
                }
                if (uaSubstrings.some((s) => ua.includes(s))) {
                    recordViolation(ip);
                    console.log("UA:", ua);
                    console.log("UA Substring detected:", request.url);
                    return reply
                        .status(403)
                        .send({ code: 403, msg: "爬你妈呢", timestamp: time() });
                }
                if (ua == "Mozilla/5.0") {
                    recordViolation(ip);
                    console.log("Mozilla/5.0 detected:", request.url);
                    return reply
                        .status(403)
                        .send({ code: 403, msg: "爬你妈呢", timestamp: time() });
                }
                if (isSuspiciousBehavior(request)) {
                    recordViolation(ip);
                    console.log("Suspicious behavior detected:", request.url);
                    return reply
                        .status(403)
                        .send({ code: 403, msg: "可疑请求行为", timestamp: time() });
                }
                if (isRateLimited(ip, request.url))
                    return reply
                        .status(429)
                        .send({ code: 429, msg: "请求过于频繁", timestamp: time() });
            },
        );
        fastify.addHook(
            "onResponse",
            async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                if (typeof global.gc === "function") {
                    global.gc();
                }
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
            return returnPage("index.html", params, reply);
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
        fastify.get(
            "/login",
            {
                schema: {
                    querystring: {
                        type: "object",
                        properties: {
                            page: { type: "string" },
                        },
                    },
                },
            },
            async (
                request: FastifyRequest<{ Querystring: { page: string } }>,
                reply: FastifyReply,
            ): Promise<Object> => {
                const { page } = request.query;
                const cookieId = request.cookies.ID;
                if (cookieId) {
                    const redirectUrl = page ? decodeURIComponent(page) : "https://iftc.koyeb.app/";
                    return reply.redirect(redirectUrl);
                }
                const params: Record<string, any> = {};
                return returnPage("login/index.html", params, reply);
            },
        );
        fastify.get(
            "/signup",
            {
                schema: {
                    querystring: {
                        type: "object",
                        properties: {
                            page: { type: "string" },
                        },
                    },
                },
            },
            async (
                request: FastifyRequest<{ Querystring: { page: string } }>,
                reply: FastifyReply,
            ): Promise<Object> => {
                const { page } = request.query;
                const cookieId = request.cookies.ID;
                if (cookieId) {
                    const redirectUrl = page ? decodeURIComponent(page) : "https://iftc.koyeb.app/";
                    return reply.redirect(redirectUrl);
                }
                const params: Record<string, any> = {};
                return returnPage("signup/index.html", params, reply);
            },
        );
        fastify.get(
            "/auth",
            {
                schema: {
                    querystring: {
                        type: "object",
                        properties: {
                            token: { type: "string" },
                            callback: { type: "string" },
                        },
                        required: ["token", "callback"],
                    },
                },
            },
            async (
                request: FastifyRequest<{ Querystring: { token: string; callback: string } }>,
                reply: FastifyReply,
            ): Promise<Object> => {
                const { token, callback } = request.query;
                const decodedCallback = decodeURIComponent(callback);
                const tempData = authTempTokens.get(token);
                if (!tempData || Date.now() > tempData.expiresAt) {
                    authTempTokens.delete(token);
                    reply.headers({ "Content-Type": "text/html; charset=utf-8" });
                    return reply.send(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>授权失败</title>
    <style>
        body{display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f5f5f5}
        .box{text-align:center;padding:40px;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.1)}
        h2{color:#e74c3c;margin-bottom:12px}
        p{color:#666}
    </style>
</head>
<body>
    <div class="box">
        <h2>授权失败</h2>
        <p>鉴权Token无效或已过期</p>
    </div>
</body>
</html>`);
                }
                reply.headers({ "Content-Type": "text/html; charset=utf-8" });
                return reply.send(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第三方授权登录</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{display:flex;justify-content:center;align-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f5f5f5}
        .box{text-align:center;padding:40px;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.1);max-width:400px;width:90%}
        .icon{width:64px;height:64px;margin:0 auto 16px;background:#3498db;border-radius:50%;display:flex;align-items:center;justify-content:center}
        .icon svg{width:32px;height:32px;fill:#fff}
        h2{margin-bottom:8px;color:#333}
        .desc{color:#666;margin-bottom:24px;font-size:14px}
        .btns{display:flex;gap:12px;justify-content:center}
        .btn{padding:10px 32px;border:none;border-radius:8px;font-size:15px;cursor:pointer;transition:all .2s}
        .btn-cancel{background:#eee;color:#666}
        .btn-cancel:hover{background:#ddd}
        .btn-authorize{background:#3498db;color:#fff}
        .btn-authorize:hover{background:#2980b9}
        .error{color:#e74c3c;margin-top:16px;display:none;font-size:14px}
    </style>
</head>
<body>
    <div class="box">
        <div class="icon">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
        <h2>第三方授权登录</h2>
        <p class="desc">一个外部应用请求获取您的账号信息</p>
        <div class="btns">
            <button class="btn btn-cancel" onclick="doCancel()">取消</button>
            <button class="btn btn-authorize" onclick="doAuthorize()">授权</button>
        </div>
        <p class="error" id="error">请先登录后再进行授权</p>
    </div>
    <script>
        const AUTH_TOKEN = ${JSON.stringify(token)};
        const CALLBACK = ${JSON.stringify(decodedCallback)};
        function doCancel() {
            window.location.href = CALLBACK;
        }
        async function doAuthorize() {
            let id = null;
            try {
                if (window.cookieStore) {
                    const cookie = await window.cookieStore.get("ID");
                    if (cookie) id = cookie.value;
                }
            } catch (e) {}
            if (!id) {
                const match = document.cookie.match(/(?:^|;\\s*)ID=([^;]*)/);
                if (match) id = decodeURIComponent(match[1]);
            }
            if (!id) {
                const loginUrl = "/login?page=" + encodeURIComponent("/auth?token=" + encodeURIComponent(AUTH_TOKEN) + "&callback=" + encodeURIComponent(CALLBACK));
                window.location.href = loginUrl;
                return;
            }
            const sep = CALLBACK.includes("?") ? "&" : "?";
            window.location.href = CALLBACK + sep + "token=" + encodeURIComponent(AUTH_TOKEN) + "&id=" + encodeURIComponent(id);
        }
    </script>
</body>
</html>`);
            },
        );
        fastify.get(
            "/resetpw",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const params: Record<string, any> = {};
                return returnPage("resetpw/index.html", params, reply);
            },
        );
        fastify.get(
            "/resetpw/:uuid",
            {
                schema: {
                    params: {
                        type: "object",
                        properties: {
                            uuid: { type: "string" },
                        },
                        required: ["uuid"],
                    },
                },
            },
            async (
                request: FastifyRequest<{ Params: { uuid: string } }>,
                reply: FastifyReply,
            ): Promise<Object> => {
                const { uuid } = request.params;
                try {
                    const uuidData = await uuid_db.getData(uuid);
                    if (uuidData.code === 200 && uuidData.fields.length > 0) {
                        const ID = uuidData.fields[0].ID;
                        const type = uuidData.fields[0].类型;
                        if (type != "resetpassword") {
                            return reply.send({
                                code: 400,
                                msg: "UUID类型错误",
                                timestamp: time(),
                            });
                        }
                        const data = uuidData.fields[0].数据;
                        const j = await user.getByID(ID);
                        if (j.code != 200) {
                            return reply.send({
                                code: 404,
                                msg: "用户未找到",
                                timestamp: time(),
                            });
                        }
                        const token = j.fields[0].token;
                        if (!token) {
                            return reply.send({
                                code: 500,
                                msg: "用户无token，无法重置密码",
                                timestamp: time(),
                            });
                        }
                        await user.update(token, "password", data);
                        await uuid_db.deleteData(uuid);
                        sendMail({
                            to: j.fields[0].邮箱 || "",
                            subject: "密码重置成功",
                            html: `用户 <b>${j.fields[0].昵称} (${j.fields[0].邮箱})</b> 成功重置了密码`,
                        });
                        return reply.send({
                            code: 200,
                            msg: "密码重置成功",
                            timestamp: time(),
                        });
                    }
                    return reply.send({
                        code: 404,
                        msg: "UUID未找到或已过期",
                        timestamp: time(),
                    });
                } catch (error) {
                    return reply.send({
                        code: 500,
                        msg: "服务内部错误",
                        error: error,
                        timestamp: time(),
                    });
                }
            },
        );
        fastify.get(
            "/user",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const cookieId = request.cookies.ID;
                if (!cookieId) {
                    return reply.redirect("/login?page=" + encodeURIComponent(request.url));
                }
                try {
                    const apiUrl = `http://127.0.0.1:${port}/api/user/details?id=${cookieId}`;
                    const response = await fetch(apiUrl, {
                        headers: { "X-PASS": backendPass },
                    });
                    const data = await response.json();
                    if (data.code !== 200 || !data.data) {
                        return reply.redirect("/login");
                    }
                    const user = data.data;
                    const params: Record<string, any> = {
                        id: user.ID,
                        username: user.nickname || user.username || "",
                        avatar: user.avatar || "/static/avatar.png",
                        email: user.email || "",
                        vc: user.VC || 0,
                        registrationDate:
                            new Date(user.createdAt * 1000).toLocaleString("zh-CN") || "",
                        updatedDate: new Date(user.updatedAt * 1000).toLocaleString("zh-CN") || "",
                    };
                    return returnPage("user/index.html", params, reply);
                } catch (e) {
                    console.error("Error fetching user data:", e);
                    return reply.redirect("/login");
                }
            },
        );
        fastify.get(
            "/VVMusic",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const params: Record<string, any> = {};
                return returnPage("VVMusic/index.html", params, reply);
            },
        );
        fastify.get(
            "/noob/editor",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const params: Record<string, any> = {};
                return returnPage("noob/editor/index.html", params, reply);
            },
        );
        fastify.get(
            "/kubejs",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const params: Record<string, any> = {};
                return reply.redirect("https://kubejs.nocode.host");
            },
        );
        fastify.get(
            "/MagicFive",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const params: Record<string, any> = {};
                return returnPage("神奇五客/index.html", params, reply);
            },
        );
        fastify.get(
            "/kjsc",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const params: Record<string, any> = {};
                return reply.redirect("https://kjsc.nocode.host");
            },
        );
        fastify.get(
            "/feedback",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                reply.header("Content-Type", "text/html; charset=utf-8");
                return `反馈功能正在开发中...<br>如需反馈请使用邮箱 <a href="mailto:iftcceo@139.com">iftcceo@139.com</a></a> 或 <a href="mailto:iftcceo@gmail.com">iftcceo@gmail.com</a>`;
            },
        );
        fastify.get(
            "/mini-tsc",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const params: Record<string, any> = {};
                return returnPage("mini-tsc/index.html", params, reply);
            },
        );
        API(fastify);
        fastify.get(
            "/safejump",
            {
                schema: {
                    querystring: {
                        type: "object",
                        properties: {
                            page: { type: "string" },
                        },
                    },
                },
            },
            async (
                request: FastifyRequest<{ Querystring: { page: string } }>,
                reply: FastifyReply,
            ): Promise<Object> => {
                const { page } = request.query;
                if (!page) return reply.status(400).send(null);
                try {
                    const url = new URL(formatUrl(page));
                    const domain = url.hostname;
                    if (checkIntranetIP(domain)) {
                        reply.headers({
                            "Content-Type": "text/html",
                        });
                        return reply.send(`<!DOCTYPE html>
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
                    }
                    const icpcheckapi = "https://uapis.cn/api/v1/network/icp";
                    const r = await fetch(`${icpcheckapi}?domain=${domain}`);
                    const j = await r.json();
                    if (j.code == 200) return reply.redirect(formatUrl(page));
                    else {
                        if (await checkWhitelist(domain)) return reply.redirect(formatUrl(page));
                        else {
                            reply.headers({
                                "Content-Type": "text/html",
                            });
                            return reply.send(`<!DOCTYPE html>
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
                } catch (error) {
                    return reply.status(500).send(null);
                }
            },
        );
        fastify.get(
            "/favicon.ico",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                reply.headers({
                    "Content-Type": "image/x-icon",
                });
                return fs.readFile("favicon.ico");
            },
        );
        fastify.get(
            "/file/blockly/workspace-search",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const content: string = await fs.readFile(
                    "node_modules/@blockly/plugin-workspace-search/dist/index.js",
                    "utf8",
                );
                if (content) {
                    reply.headers({
                        "Content-Type": "text/javascript;charset=utf-8",
                    });
                    return reply.send(content);
                } else return reply.status(500).send(null);
            },
        );
        fastify.get(
            "/file/blockly/shadow-block-converter",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const content: string = await fs.readFile(
                    "node_modules/@blockly/shadow-block-converter/dist/index.js",
                    "utf8",
                );
                if (content) {
                    reply.headers({
                        "Content-Type": "text/javascript;charset=utf-8",
                    });
                    return reply.send(content);
                } else return reply.status(500).send(null);
            },
        );
        fastify.get(
            "/file/blockly/blockly-plugin-workspace-multiselect",
            async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
                const content: string = await fs.readFile(
                    "node_modules/@mit-app-inventor/blockly-plugin-workspace-multiselect/dist/index.js",
                    "utf8",
                );
                if (content) {
                    reply.headers({
                        "Content-Type": "text/javascript;charset=utf-8",
                    });
                    return reply.send(content);
                } else return reply.status(500).send(null);
            },
        );
        fastify.get(
            "/stream-test",
            async (request: FastifyRequest, reply: FastifyReply): Promise<undefined> => {
                reply.raw.writeHead(200, {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    Connection: "keep-alive",
                });
                const stream = new Readable({
                    read() {},
                });
                stream.pipe(reply.raw);
                const interval = setInterval(() => {
                    stream.push(`data: ${Date.now()}\n\n`);
                }, 1000);
                setTimeout(() => {
                    stream.destroy();
                    clearInterval(interval);
                }, 15000);
                request.raw.on("close", () => {
                    stream.destroy();
                    clearInterval(interval);
                });
            },
        );
        fastify.get(
            "/code",
            {
                schema: {
                    querystring: {
                        type: "object",
                        properties: {
                            code: { type: "number" },
                            msg: { type: "string" },
                        },
                        required: ["code"],
                    },
                },
            },
            async (
                request: FastifyRequest<{ Querystring: { code: number; msg: string } }>,
                reply: FastifyReply,
            ): Promise<Object> => {
                const { code, msg } = request.query;
                return reply.status(code).send({
                    code: code,
                    msg: msg || (code == 200 ? "请求成功" : "请求失败"),
                    timestamp: time(),
                });
            },
        );
        console.log(">>> [STEP 7] Routes added.");
        console.log(">>> [STEP 8] Starting listener...");
        await fastify.listen({ port: port, host: "0.0.0.0" });
        console.log(`Server listening at http://0.0.0.0:${port}`);
        console.log("Telegram Bot", TGBot);
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
        //     const r: Response = await fetch("https://iftc.deno.dev");
        //     console.log(await r.text());
    } catch (e) {
        console.error("Monitor error:", e);
    }
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

setInterval(async (): Promise<void> => {
    if (typeof global.gc === "function") {
        global.gc();
    }
}, 3600000);

(async () => {
    try {
        const r = await fetch(
            "https://dbmp-xbgmorqeur6oh81z.database.nocode.cn/storage/v1/object/public/files/GeoLite2-City.mmdb",
        );
        const buffer = await r.arrayBuffer();
        await fs.writeFile("GeoLite2-City.mmdb", Buffer.from(buffer));
        console.log("GeoLite2-City.mmdb downloaded successfully");
    } catch (e) {
        console.error("Failed to download GeoLite2-City.mmdb:", e);
    }
})();

let whitelistCache: Set<string> | null = null;
let whitelistCacheTime = 0;
const WHITELIST_CACHE_TTL = 60000;

async function checkWhitelist(domain: string): Promise<boolean> {
    const now = Date.now();
    if (whitelistCache && now - whitelistCacheTime < WHITELIST_CACHE_TTL) {
        return whitelistCache.has(domain);
    }
    try {
        const data = await fs.readFile("whitelist.json", "utf-8");
        const list: string[] = JSON.parse(data);
        whitelistCache = new Set(list);
        whitelistCacheTime = now;
        return whitelistCache.has(domain);
    } catch (e) {
        console.error("Failed to read whitelist.json:", e);
        return false;
    }
}

function formatUrl(url: string): string {
    url = url.trim();
    url = decodeURIComponent(url);
    if (url.startsWith("https://") || url.startsWith("http://")) return url;
    return `http://${url}`;
}

function checkIntranetIP(domain: string): boolean {
    const intranetDomains: string[] = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
    if (intranetDomains.includes(domain)) return true;
    const ipv4Pattern: RegExp = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/;
    if (ipv4Pattern.test(domain)) return true;
    if (domain.startsWith("fe80:") || domain.startsWith("fc00:") || domain.startsWith("fd00:"))
        return true;
    return false;
}
