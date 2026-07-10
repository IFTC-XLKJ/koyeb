import type { FastifyInstance, FastifyReply, FastifyRequest, FastifyError } from "fastify";
import type {
    AppUpdateCheckResult,
    GetByIDResponse,
    SearchResponse,
    UserData,
    UserLoginResponse,
    UserRegisterResponse,
    UserResponse,
} from "./types.ts";
import User from "./User.ts";
import { supabase, messagesTable, avatarBucket } from "./shared.ts";
import RecordMessages from "./RecordMessages.ts";
import maxmind from "maxmind";
import https from "https";
import fetch from "node-fetch";
import type { RequestInit } from "node-fetch";
import AppUpdateCheck from "./AppUpdateCheck.ts";
// @ts-ignore
import weather from "weather-js";
import { KJSC } from "./KJSC.ts";
// @ts-ignore
import { Segment } from "node-segment";
import whois from "whois";
import type { WhoisResult } from "whois";
import fs from "fs/promises";

const user: User = new User();
const appUpdateCheck: AppUpdateCheck = new AppUpdateCheck();
const KJSCInstance: KJSC = new KJSC();
const startTime = Date.now();

// Singleton GeoLite2 reader - cached in memory instead of opening per request
let geoReader: any = null;
let geoReaderLoading: Promise<void> | null = null;

async function getGeoReader() {
    if (geoReader) return geoReader;
    if (geoReaderLoading) return geoReaderLoading.then(() => geoReader);
    geoReaderLoading = maxmind
        .open("./GeoLite2-City.mmdb")
        .then((reader) => {
            geoReader = reader;
            geoReaderLoading = null;
        })
        .catch((e) => {
            console.error("Failed to load GeoLite2:", e);
            geoReaderLoading = null;
            throw e;
        });
    await geoReaderLoading;
    return geoReader;
}

interface UserDetailsQueryParams {
    id: number;
}

interface UserMessagesQueryParams {
    id: number;
    start: number;
    end: number;
}

interface UserMessageItem {
    createdAt: number;
}

export default function (fastify: FastifyInstance) {
    console.log("defining API routes...");
    fastify.setErrorHandler(
        (error: FastifyError, request: FastifyRequest, reply: FastifyReply): Object => {
            if (error.validation) {
                const firstError = error.validation[0];
                return reply.status(400).send({
                    code: 400,
                    msg: `参数校验失败: ${firstError.message}`,
                    timestamp: Date.now(),
                    details: error.validation,
                });
            }
            return reply.status(error.statusCode || 500).send({
                code: error.statusCode || 500,
                msg: error.message,
                timestamp: Date.now(),
            });
        },
    );
    fastify.get(
        "/api/user/details",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                    },
                    required: ["id"],
                },
            },
        },
        async (
            request: FastifyRequest<{ Querystring: UserDetailsQueryParams }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const { id } = request.query;
            console.log(id, typeof id);
            try {
                const json: GetByIDResponse = await user.getByID(id);
                const code: number = json["code"];
                if (code == 200) {
                    const data: UserData = json.fields[0];
                    if (!data)
                        return reply.status(404).send({
                            code: 404,
                            id: id,
                            msg: "账号不存在",
                            timestamp: Date.now(),
                        });
                    return reply.send({
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
                        timestamp: Date.now(),
                    });
                } else {
                    return reply.status(code).send({
                        code: code,
                        msg: json["msg"],
                        timestamp: Date.now(),
                    });
                }
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/user/messages",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        start: { type: "number" },
                        end: { type: "number" },
                    },
                    required: ["id", "start", "end"],
                },
            },
        },
        async (
            request: FastifyRequest<{ Querystring: UserMessagesQueryParams }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const { id, start, end } = request.query;
            try {
                const { data, error } = await messagesTable
                    .select()
                    .eq("uid", id)
                    .range(start - 1, end - 1)
                    .order("createdAt", { ascending: false });
                if (error)
                    return reply.status(500).send({
                        code: 500,
                        msg: "Internal Server Error",
                        error: error.message,
                        timestamp: Date.now(),
                    });
                return reply.send({
                    code: 200,
                    msg: "获取消息成功",
                    data: data.map((item: UserMessageItem) => ({
                        ...item,
                        createdAt: Date.parse(String(item.createdAt)),
                    })),
                    timestamp: Date.now(),
                });
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/user/search",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        keyword: { type: "string" },
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{ Querystring: { keyword: string } }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const { keyword } = request.query;
            try {
                const json: SearchResponse = await user.search(decodeURIComponent(keyword || ""));
                const code: number = json["code"];
                if (code == 200) {
                    return reply.send({
                        code: 200,
                        msg: "搜索成功",
                        data: json.fields.map((item: UserData) => ({
                            ID: item.ID,
                            username: String(item.昵称),
                            avatar: item.头像,
                            VC: item.V币,
                            email: item.邮箱,
                            VIP: !!item.VIP,
                            signed: item.签到 || 0,
                            op: item.管理员 == 1,
                            freezed: item.封号 == 1,
                            title: item.头衔,
                            titleColor: item.头衔色,
                            createdAt: item.createdAt,
                            updatedAt: item.updatedAt,
                        })),
                        keyword: keyword,
                        timestamp: Date.now(),
                    });
                } else {
                    return reply.status(code).send({
                        code: code,
                        msg: json["msg"],
                        timestamp: Date.now(),
                    });
                }
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/user/login",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        user: { type: "string" },
                        password: { type: "string" },
                    },
                    required: ["user", "password"],
                },
            },
        },
        async (
            request: FastifyRequest<{ Querystring: { user: string; password: string } }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const { password } = request.query;
            const _user: string = request.query.user;
            console.log(_user, password);
            try {
                const json: UserLoginResponse = await user.login(
                    decodeURIComponent(_user || ""),
                    decodeURIComponent(password || ""),
                );
                const code: number = json["code"];
                if (code == 200) {
                    if (json.fields[0].封号 == 1) {
                        return reply.status(403).send({
                            code: 403,
                            msg: "封号用户",
                            timestamp: Date.now(),
                        });
                    }
                    const data = json.fields[0];
                    if (!data)
                        return reply.status(401).send({
                            code: 401,
                            msg: "账号或密码错误",
                            timestamp: Date.now(),
                        });
                    reply.send({
                        code: 200,
                        msg: "登录成功",
                        id: data.ID,
                        token: data.token,
                        timestamp: Date.now(),
                    });
                    return await RecordMessages.recordMessage({
                        title: "用户登录",
                        uid: data.ID,
                        content: `用户 <b>${data.昵称} (${data.邮箱})</b> 登录了账号，登录IP为 <b>${request.headers["x-forwarded-for"] || "Unknown"}</b>，登录地点为 <b>${await lookupIP(request.headers["x-forwarded-for"] || null)}</b>`,
                    });
                } else {
                    return reply.status(code).send({
                        code: code,
                        msg: json["msg"],
                        timestamp: Date.now(),
                    });
                }
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误： " + (error as Error).message,
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/user/register",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        nickname: { type: "string" },
                        email: { type: "string" },
                        password: { type: "string" },
                        avatar: { type: "string" },
                    },
                    required: ["nickname", "email", "password"],
                },
            },
        },
        async (
            request: FastifyRequest<{
                Querystring: { nickname: string; email: string; password: string; avatar: string };
            }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const { nickname, email, password, avatar } = request.query;
            if (decodeURIComponent(nickname).includes("#"))
                return reply.status(400).send({
                    code: 400,
                    msg: "昵称不能包含#字符",
                    timestamp: Date.now(),
                });
            if (
                decodeURIComponent(email).includes(" ") ||
                decodeURIComponent(nickname).includes(" ") ||
                decodeURIComponent(password).includes(" ")
            )
                return reply.status(400).send({
                    code: 400,
                    msg: "昵称、邮箱和密码不能包含空格字符",
                    timestamp: Date.now(),
                });
            try {
                const json: UserRegisterResponse = await user.register(
                    decodeURIComponent(email || ""),
                    decodeURIComponent(nickname || ""),
                    decodeURIComponent(avatar || ""),
                    decodeURIComponent(password || ""),
                );
                const code: number = json["code"];
                if (code == 200) {
                    reply.send({
                        code: 200,
                        msg: "注册成功",
                        id: json.fields[0].ID,
                        timestamp: Date.now(),
                    });
                    return await RecordMessages.recordMessage({
                        title: "新用户注册",
                        uid: json.fields[0].ID,
                        content: `用户 ${decodeURIComponent(nickname)} (${decodeURIComponent(email)}) 注册了账号，ID为 ${json.fields[0].ID}，注册IP为 <b>${request.headers["x-forwarded-for"] || "Unknown"}</b>，注册地点为 <b>${await lookupIP(request.headers["x-forwarded-for"] || null)}</b>`,
                    });
                } else {
                    return reply.status(code).send({
                        code: code,
                        msg: json["msg"],
                        timestamp: Date.now(),
                    });
                }
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/music_resource/info",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        key: { type: "string" },
                        page: { type: "number" },
                        limit: { type: "number" },
                    },
                    required: ["key"],
                },
            },
        },
        async (
            request: FastifyRequest<{
                Querystring: { key: string; page: number; limit: number };
            }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const { key, page, limit } = request.query;
            try {
                const url = `https://www.lihouse.xyz/coco_widget/music_resource/info?key=${encodeURIComponent(key)}&page=${page}&limit=${limit}`;
                const agent = new https.Agent({
                    rejectUnauthorized: false,
                });
                const fetchOptions: RequestInit = {
                    agent: agent,
                };
                const r = await fetch(url, fetchOptions);
                if (!r.ok) {
                    return reply.status(r.status).send({
                        code: r.status,
                        msg: `External API error: ${await r.text()}`,
                        timestamp: Date.now(),
                    });
                }
                const data = await r.json();
                return reply.send(data);
            } catch (error: unknown) {
                console.error("Fetch error:", error);
                return reply.status(500).send({
                    code: 500,
                    msg: "fetch failed",
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/music_resource/id/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                    },
                    required: ["id"],
                },
            },
        },
        async (
            request: FastifyRequest<{ Params: { id: string } }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const { id } = request.params;
            try {
                const url = `https://www.lihouse.xyz/coco_widget/music_resource/id/${encodeURIComponent(id)}`;
                const agent = new https.Agent({
                    rejectUnauthorized: false,
                });
                const fetchOptions: RequestInit = {
                    agent: agent,
                };
                const r = await fetch(url, fetchOptions);
                if (!r.ok) {
                    return reply.status(r.status).send({
                        code: r.status,
                        msg: `External API error: ${await r.text()}`,
                        timestamp: Date.now(),
                    });
                }
                return reply.send(await r.json());
            } catch (error: unknown) {
                console.error("Fetch error:", error);
                return reply.status(500).send({
                    code: 500,
                    msg: "fetch failed",
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.post(
        "/api/upload-avatar",
        async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
            try {
                const data = await request.file({
                    limits: {
                        fileSize: 1024 * 1024 * 5,
                    },
                });
                if (!data || !data.file) {
                    return reply.status(400).send({
                        code: 400,
                        msg: "No avatar file provided",
                        timestamp: Date.now(),
                    });
                }
                const chunks: Buffer[] = [];
                for await (const chunk of data.file) {
                    chunks.push(chunk);
                }
                const fileBuffer: Buffer = Buffer.concat(chunks);
                if (fileBuffer.length > 1024 * 1024 * 5) {
                    return reply.status(400).send({
                        code: 400,
                        msg: "File too large",
                        timestamp: Date.now(),
                    });
                }
                const isImage: boolean = await isImageFromFile(fileBuffer);
                if (!isImage) {
                    return reply.status(400).send({
                        code: 400,
                        msg: "File must be an Image",
                        timestamp: Date.now(),
                    });
                }
                const uuid: string = generateUUID();
                const fileName: string = `${uuid}.png`;
                const contentType: string = data.mimetype || "image/png";
                const { data: uploadData, error } = await avatarBucket.upload(
                    fileName,
                    fileBuffer,
                    {
                        contentType: contentType,
                        cacheControl: "public, max-age=31536000",
                        upsert: true,
                    },
                );
                if (error) {
                    throw error;
                }
                return reply.send({
                    code: 200,
                    msg: "Upload successful",
                    data: uploadData,
                    error: null,
                    timestamp: Date.now(),
                });
            } catch (err: unknown) {
                console.error("Avatar upload error:", err);
                if ((err as Error).message && (err as Error).message.includes("File too large")) {
                    return reply.status(400).send({
                        code: 400,
                        msg: "File too large",
                        timestamp: Date.now(),
                    });
                }
                return reply.status(500).send({
                    code: 500,
                    msg: "Upload failed",
                    error: (err as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/appupdatecheck",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        packageName: { type: "string" },
                        versionCode: { type: "string" },
                    },
                    required: ["packageName", "versionCode"],
                },
            },
        },
        async (
            request: FastifyRequest<{ Querystring: { packageName: string; versionCode: string } }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const { packageName, versionCode } = request.query;
            try {
                const result: AppUpdateCheckResult = await appUpdateCheck.check(
                    decodeURIComponent(packageName || ""),
                    Number(versionCode) || 0,
                );
                return reply.send(result);
            } catch (error: unknown) {
                console.error("App update check error:", error);
                return reply.status(500).send({
                    code: 500,
                    msg: "Update check failed",
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/ip",
        async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
            return reply.send({
                code: 200,
                msg: "请求成功",
                ip: request.headers["x-forwarded-for"] || null,
                timestamp: Date.now(),
            });
        },
    );
    fastify.get(
        "/api/ip2location",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        ip: { type: "string" },
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{ Querystring: { ip: string } }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const ip = request.query.ip || request.headers["x-forwarded-for"] || null;
            return reply.send({
                code: 200,
                msg: "请求成功",
                ip: ip,
                location: await lookupIP(ip),
                timestamp: Date.now(),
            });
        },
    );
    // fastify.get(
    //     "/api/weather",
    //     {
    //         schema: {
    //             querystring: {
    //                 type: "object",
    //                 properties: {
    //                     city: { type: "string" },
    //                 },
    //             },
    //         },
    //     },
    //     async (request: FastifyRequest<{ Querystring: { city: string } }>, reply: FastifyReply) => {
    //         const { city } = request.query;
    //         weather.find({ search: city, degreeType: "C" }, (err: Error | null, result: any) => {
    //             if (err) {
    //                 console.error("Weather API error:", err);
    //                 return reply.status(500).send({
    //                     code: 500,
    //                     msg: "Weather API error",
    //                     error: err.message,
    //                     timestamp: Date.now(),
    //                 });
    //             }
    //             if (!result || result.length === 0) {
    //                 return reply.status(404).send({
    //                     code: 404,
    //                     msg: "City not found",
    //                     timestamp: Date.now(),
    //                 });
    //             }
    //             return reply.send({
    //                 code: 200,
    //                 msg: "请求成功",
    //                 data: result,
    //                 timestamp: Date.now(),
    //             });
    //         });
    //     },
    // );
    fastify.post(
        "/api/kjsc/post/publish",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        token: { type: "string" },
                        title: { type: "string" },
                        category: { type: "string" },
                        content: { type: "string" },
                        tags: { type: "array", items: { type: "string" } },
                        files: { type: "array", items: { type: "string" } },
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{
                Body: {
                    token: string;
                    title: string;
                    category: number;
                    content: string;
                    tags: string[];
                    files: string[];
                };
            }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            try {
                const { token, title, category, content, tags, files } = request.body;
                const json: UserResponse = await user.getByToken(token);
                if (json.code !== 200 || json.fields.length === 0)
                    return reply.status(401).send({
                        code: 401,
                        msg: "Invalid token",
                        timestamp: Date.now(),
                    });
                const { ID, 昵称, 头像 } = json.fields[0];
                const json2 = await KJSCInstance.publishPost(
                    title,
                    category,
                    content,
                    tags,
                    files,
                    ID,
                    昵称,
                );
                if (json2.error)
                    return reply.status(500).send({
                        code: 500,
                        msg: "Failed to publish post: " + json2.error.message,
                        error: json2.error.message,
                        timestamp: Date.now(),
                    });
                return reply.send({
                    code: 200,
                    msg: "发布成功",
                    data: json2,
                    timestamp: Date.now(),
                });
            } catch (error: unknown) {
                console.error("KJSC API error:", error);
                return reply.status(500).send({
                    code: 500,
                    msg: "KJSC API error: " + (error as Error).message,
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/user/loginbytoken",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        token: { type: "string" },
                    },
                    required: ["token"],
                },
            },
        },
        async (
            request: FastifyRequest<{
                Querystring: {
                    token: string;
                };
            }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const token = request.query.token || "";
            const json: UserResponse = await user.getByToken(token);
            if (json.code !== 200)
                return reply.status(json.code).send({
                    code: json.code,
                    msg: json.msg,
                    timestamp: Date.now(),
                });
            if (json.fields.length === 0)
                return reply.status(401).send({
                    code: 401,
                    msg: "Invalid token",
                    timestamp: Date.now(),
                });
            const data = json.fields[0];
            if (data.封号 == 1)
                return reply.status(403).send({
                    code: 403,
                    msg: "封号用户",
                    timestamp: Date.now(),
                });
            return reply.send({
                code: 200,
                msg: "登录成功",
                token: token,
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
            });
        },
    );
    fastify.get("/api/runtime", async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.send({
            code: 200,
            msg: "请求成功",
            runtime: formatDuration(Date.now() - startTime),
            runtimestamp: Date.now() - startTime,
            timestamp: Date.now(),
        });
    });
    fastify.post("/api/ccwoss", async (request: FastifyRequest, reply: FastifyReply) => {});
    fastify.get(
        "/api/participle",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        text: { type: "string" },
                    },
                    required: ["text"],
                },
            },
        },
        async (
            request: FastifyRequest<{
                Querystring: {
                    text: string;
                };
            }>,
            reply: FastifyReply,
        ) => {
            const { text } = request.query;
            const segment = new Segment();
            segment.useDefault();
            try {
                const result = segment.doSegment(text, {
                    removePunct: true,
                    removeStopword: true,
                });
                return reply.send({
                    code: 200,
                    msg: "请求成功",
                    data: result,
                    timestamp: Date.now(),
                });
            } catch (error: unknown) {
                console.error("Participle error:", error);
                return reply.status(500).send({
                    code: 500,
                    msg: "Participle error: " + (error as Error).message,
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/sign",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        token: { type: "string" },
                    },
                    required: ["token"],
                },
            },
        },
        async (
            request: FastifyRequest<{ Querystring: { token: string } }>,
            reply: FastifyReply,
        ) => {
            const { token } = request.query;
            try {
                const j = await user.getByToken(token);
                if (j.code !== 200)
                    return reply.status(j.code).send({
                        code: j.code,
                        msg: j.msg,
                        timestamp: Date.now(),
                    });
                if (j.fields.length === 0)
                    return reply.status(401).send({
                        code: 401,
                        msg: "Invalid token",
                        timestamp: Date.now(),
                    });
                const data = j.fields[0];
                const singedAt = data.签到 || 0;
                const signedDate = formatDate(singedAt);
                const nowDate = formatDate(Date.now());
                const isSameDay =
                    signedDate.getFullYear() === nowDate.getFullYear() &&
                    signedDate.getMonth() === nowDate.getMonth() &&
                    signedDate.getDate() === nowDate.getDate();
                if (isSameDay) {
                    return reply.status(400).send({
                        code: 400,
                        msg: "今日已签到",
                        signedAt: singedAt,
                        timestamp: Date.now(),
                    });
                }
                const j2 = await user.sign(token);
                if (j2.code !== 200)
                    return reply.status(j2.code).send({
                        code: j2.code,
                        msg: j2.msg,
                        timestamp: Date.now(),
                    });
                return reply.send({
                    code: 200,
                    msg: "签到成功",
                    signedAt: Date.now(),
                    timestamp: Date.now(),
                });
            } catch (error: unknown) {
                console.error("Sign error:", error);
                return reply.status(500).send({
                    code: 500,
                    msg: "签到出错：" + (error as Error).message,
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/user/gettoken",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        password: { type: "string" },
                    },
                    required: ["id", "password"],
                },
            },
        },
        async (
            request: FastifyRequest<{ Querystring: { id: number; password: string } }>,
            reply: FastifyReply,
        ) => {
            const { id, password } = request.query;
            try {
                const j = await user.login(id, password);
                if (j.code !== 200)
                    return reply.status(j.code).send({
                        code: j.code,
                        msg: j.msg,
                        timestamp: Date.now(),
                    });
                if (j.fields.length === 0)
                    return reply.status(401).send({
                        code: 401,
                        msg: "Invalid password",
                        timestamp: Date.now(),
                    });
                return reply.send({
                    code: 200,
                    msg: "请求成功",
                    token: j.fields[0].token,
                    timestamp: Date.now(),
                });
            } catch (error: unknown) {
                console.error("Get token error:", error);
                return reply.status(500).send({
                    code: 500,
                    msg: "获取用户令牌出错：" + (error as Error).message,
                    error: (error as Error).message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get("/api/requestips", async (request: FastifyRequest, reply: FastifyReply) => {
        const data = await user.getAll();
        return reply.send(data);
    });
    fastify.get("/api/randomusername", async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.send({
            code: 200,
            msg: "请求成功",
            copyright: "IFTC",
            username: await randomUsername(),
            timestamp: Date.now(),
        });
    });
    fastify.get(
        "/api/user/sendcode",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        title: { type: "string" },
                        content: { type: "string" },
                    },
                    required: ["email", "title", "content"],
                },
            },
        },
        async (
            request: FastifyRequest<{
                Querystring: { email: string; title: string; content: string };
            }>,
            reply: FastifyReply,
        ) => {
            const { email, title, content } = request.query;
            // ... existing code ...
        },
    );
    fastify.get(
        "/api/weather",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        city: { type: "string" },
                    },
                    required: ["city"],
                },
            },
        },
        async (request: FastifyRequest<{ Querystring: { city: string } }>, reply: FastifyReply) => {
            const { city } = request.query;
            try {
                const weatherData = await new Promise((resolve, reject) => {
                    weather.find({ search: city, degreeType: "C" }, (err: any, result: any) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                if (!(weatherData as any[]).length) {
                    return reply.status(404).send({
                        code: 404,
                        msg: "未找到该城市的天气信息",
                        city,
                        timestamp: Date.now(),
                    });
                }

                const data = (weatherData as any[])[0];
                return reply.status(200).send({
                    code: 200,
                    msg: "success",
                    data: data,
                    city,
                    copyright: "IFTC",
                    timestamp: Date.now(),
                });
            } catch (error: any) {
                console.error("Weather API error:", error);
                return reply.status(500).send({
                    code: 500,
                    msg: "获取天气信息失败",
                    error: error.message,
                    timestamp: Date.now(),
                });
            }
        },
    );
    fastify.get(
        "/api/whois",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        domain: { type: "string" },
                    },
                    required: ["domain"],
                },
            },
        },
        async (
            request: FastifyRequest<{ Querystring: { domain: string } }>,
            reply: FastifyReply,
        ) => {
            const { domain } = request.query;
            try {
                const whoisData = await new Promise((resolve, reject) => {
                    whois.lookup(domain, (err: Error | null, data: string | WhoisResult[]) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
                return reply.status(200).send({
                    code: 200,
                    msg: "success",
                    data: {
                        domain,
                        whois: whoisData,
                    },
                    timestamp: Date.now(),
                });
            } catch (error: any) {
                console.error("WHOIS API error:", error);
                return reply.status(500).send({
                    code: 500,
                    msg: "WHOIS 查询失败",
                    error: error.message,
                    timestamp: Date.now(),
                });
            }
        },
    );
}
function time(): number {
    return Date.now();
}

async function lookupIP(ip: string | string[] | null): Promise<string> {
    if (!ip) return "Unknown";
    try {
        const reader = await getGeoReader();
        if (!reader) return "Unknown";
        const result = reader.get(Array.isArray(ip) ? ip[0] : ip);
        if (!result) {
            return "Unknown";
        }
        const continent: string | undefined =
            "continent" in result && result.continent ? result.continent.names["zh-CN"] : "";
        const country: string | undefined =
            "country" in result && result.country ? result.country.names["zh-CN"] : "";
        const subdivisions: string | undefined =
            "subdivisions" in result && result.subdivisions && result.subdivisions.length > 0
                ? result.subdivisions[0].names["zh-CN"]
                : "";
        const city: string | undefined =
            "city" in result && result.city ? result.city.names["zh-CN"] : "";
        return `${continent}${country}${subdivisions}${city}`;
    } catch (e: unknown) {
        console.log(e);
        return "Unknown";
    }
}

function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c: string): string {
        var r: number = (Math.random() * 16) | 0,
            v: number = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

async function isImageFromFile(fileBuffer: Buffer): Promise<boolean> {
    if (!fileBuffer || fileBuffer.length < 10) return false;
    const signatures: { bytes: number[]; exts: string[] }[] = [
        { bytes: [0xff, 0xd8, 0xff], exts: ["jpg", "jpeg"] },
        { bytes: [0x89, 0x50, 0x4e, 0x47], exts: ["png"] },
        { bytes: [0x47, 0x49, 0x46, 0x38], exts: ["gif"] },
        { bytes: [0x52, 0x49, 0x46, 0x46], exts: ["webp"] },
        { bytes: [0x42, 0x4d], exts: ["bmp"] },
    ];

    for (const sig of signatures) {
        let match: boolean = true;
        for (let i: number = 0; i < sig.bytes.length; i++) {
            if (fileBuffer[i] !== sig.bytes[i]) {
                match = false;
                break;
            }
        }
        if (match) return true;
    }
    return false;
}

function formatDuration(milliseconds: number) {
    let ms = milliseconds % 1000;
    let s = Math.floor((milliseconds / 1000) % 60);
    let m = Math.floor((milliseconds / (1000 * 60)) % 60);
    let h = Math.floor(milliseconds / (1000 * 60 * 60));
    return `${String(h).padStart(2, "0")}时${String(m).padStart(2, "0")}分${String(s).padStart(2, "0")}秒${String(ms).padStart(3, "0")}毫秒`;
}

function formatDate(timestamp: number) {
    return new Date(new Date(timestamp).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }));
}

async function randomUsername() {
    const wordds = await fs.readFile("Random_username.json", "utf-8");
    const words = JSON.parse(wordds);
    const adjs = words.adj;
    const nouns = words.noun;
    const adj = adjs[Math.floor(Math.random() * adjs.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const id = btoa((Math.random() * 10 ** 16).toString(36)).slice(0, 4);
    return adj + noun + id;
}
