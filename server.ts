import Fastify from "fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import os from "os";
import si from "systeminformation";
import fs from "fs/promises";
import path from "path";
import fastifyStatic from "@fastify/static";

const fastify: FastifyInstance = Fastify({
    logger: false,
});

const port: number = Number(process.env.PORT) || 8000;
const backendPass: string = "21ec360b05962410edbcc561edc8648e";
const requestCounts = new Map();
const crawlerAgents = ["slurp", "duckduckbot", "baiduspider", "facebookexternalhit", "twitterbot", "rogerbot", "python", "urllib", "requests", "httpclient", "go-http-client", "java", "curl", "wget", "axios", "node-fetch", "scrapy", "apify", "puppeteer", "playwright", "selenium"];

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "static"),
    prefix: "/static/",
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "files"),
    prefix: "/files/",
});

fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (request.headers["user-agent"] == "Koyeb Health Check") return;
    if (request.headers["X-PASS"] == backendPass) return;
    const ua: string = (request.headers["user-agent"] || "").toLowerCase();
    const ip: string | string[] = request.headers["x-forwarded-for"] || request.ip;
    if (crawlerAgents.some((agent: string) => ua.includes(agent)))
        return reply.status(403).send({
            code: 403,
            msg: "爬你妈呢",
            timestamp: time(),
        });
    if (isSuspiciousBehavior(request))
        return reply.status(403).send({
            code: 403,
            msg: "可疑请求行为",
            timestamp: time(),
        });
    if (await isRateLimited(ip))
        return reply.status(429).send({
            code: 429,
            msg: "请求过于频繁",
            timestamp: time(),
        });
});

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

function isSuspiciousBehavior(req: FastifyRequest): boolean {
    const hasBrowserHeaders: boolean = !!req.headers.accept && !!req.headers["accept-language"] && !!req.headers["accept-encoding"];
    const hasReferer: boolean = !!req.headers.referer;
    const connectionType: string | undefined = req.headers.connection;
    if (!hasBrowserHeaders && connectionType === "close") return true;
    return false;
}

fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    requestLog(request);
});

fastify.setNotFoundHandler(async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.status(404).send({
        code: 404,
        msg: `Route ${request.method} ${request.url} not found`,
        error: "Not Found",
        timestamp: time(),
    });
});

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
    if (request.headers["user-agent"] == "Koyeb Health Check" || request.headers["user-agent"] == "IFTC Bot")
        return reply.send({
            code: 200,
            msg: "请求成功",
            timestamp: time(),
        });
    const params: Record<string, any> = {};
    reply.headers({
        "Content-Type": "text/html; charset=utf-8",
    });
    try {
        const content: string = await mixed("pages/index.html", params);
        if (typeof content !== "string") throw new Error("Invalid content type");
        console.log("Content:", content);
        console.log("Type of content:", typeof content);
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

fastify.listen({ port: port, host: "0.0.0.0" }, (err: Error | null, address: string): void => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});

function time(): number {
    return Date.now();
}

async function mixed(filepath: string, params: Record<string, any>): Promise<string> {
    try {
        let content: string = await fs.readFile(filepath, "utf-8");
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

function requestLog(req: FastifyRequest): void {
    if (req.headers["user-agent"] == "Koyeb Health Check") return;
    if (req.headers["user-agent"] == "IFTC Bot") return console.log("状态检测请求");
    // addRequestCount();
    if (!(req.url.startsWith("/api/user/login") || req.url.startsWith("/api/user/register") || req.url.startsWith("/api/sendcode") || req.url.startsWith("/api/verifycode") || req.url.startsWith("/api/user/resetpassword") || req.url.startsWith("/api/loginbytoken") || req.url.startsWith("/api/updatetoken") || req.url.startsWith("/api/gettoken"))) {
        // ips.unshift({
        //     ip: req.headers["x-forwarded-for"],
        //     url: req.url,
        //     method: req.method,
        //     headers: req.headers,
        //     body: req.body,
        //     time: new Date(time()).toLocaleDateString("zh-CN", {
        //         year: "numeric",
        //         month: "long",
        //         day: "numeric",
        //         weekday: "long",
        //         hour: "numeric",
        //         minute: "numeric",
        //         second: "numeric",
        //     }),
        // });
    }

    console.log(`收到请求 IP: ${req.ip}或${req.headers["x-forwarded-for"]} IPs: ${req.ips} UA: ${req.headers["user-agent"]}`);
    console.log(`请求源：${req.headers["referer"] || "Unknown"}`);
    console.log(`Method: ${req.method} URL: ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
}

setInterval(async (): Promise<void> => {
    systemMonitor();
    const r: Response = await fetch("https://iftc.deno.dev");
    console.log(await r.text());
}, 30000);

setInterval((): void => {
    const time: string = new Date().toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });
    console.log("服务器正在运行中...", time);
}, 30000);

(async function (): Promise<void> {
    try {
        const r: Response = await fetch("https://dbmp-xbgmorqeur6oh81z.database.nocode.cn/storage/v1/object/public/files/GeoLite2-City.mmdb");
        await fs.writeFile("GeoLite2-City.mmdb", Buffer.from(await r.arrayBuffer()));
        console.log("GeoLite2-City.mmdb downloaded");
    } catch (e: unknown) {
        console.log(e);
    }
})();

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
    console.log(`内存使用率: ${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%`);
    console.log(`可用内存: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB`);
    console.log(`系统运行时间: ${(os.uptime() / 60 / 60).toFixed(2)} 小时`);
    console.log("=== ↑系统监控↑ ===");
}
