import Fastify from "fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import os from "os";
import si from "systeminformation";
import fs from "fs/promises";

const fastify: FastifyInstance = Fastify({
    logger: false,
});

const port: number = Number(process.env.PORT) || 8000;

fastify.setNotFoundHandler(async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.status(404).send({
        code: 404,
        msg: `Route ${request.method} ${request.url} not found`,
        error: "Not Found",
    });
});

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
    return { hello: "world" };
});

fastify.listen({ port: port, host: "0.0.0.0" }, (err: Error | null, address: String): void => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});

setInterval(async (): Promise<void> => {
    systemMonitor();
    const r: Response = await fetch("https://iftc.deno.dev");
    console.log(await r.text());
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
