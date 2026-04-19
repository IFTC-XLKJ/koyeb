import type { FastifyInstance, FastifyReply, FastifyRequest, FastifyError } from "fastify";
import type {
    GetByIDResponse,
    SearchResponse,
    UserData,
    UserLoginResponse,
    UserRegisterResponse,
} from "./types.ts";
import User from "./User.ts";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { StorageClient } from "@supabase/storage-js";
import { PostgrestClient } from "@supabase/postgrest-js";
import RecordMessages from "./RecordMessages.ts";
import maxmind from "maxmind";

const user: User = new User();
const SUPABASE_URL: string = "https://dbmp-xbgmorqeur6oh81z.database.nocode.cn";
const SUPABASE_ANON_KEY: string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ2OTc5MjAwLCJleHAiOjE5MDQ3NDU2MDB9.11QbQ5OW_m10vblDXAlw1Qq7Dve5Swzn12ILo7-9IXY";
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const avatarBucket = supabase.storage.from("avatar");
const messagesTable = supabase.from("Messages");

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
                            timestamp: time(),
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
                        timestamp: time(),
                    });
                } else {
                    return reply.status(code).send({
                        code: code,
                        msg: json["msg"],
                        timestamp: time(),
                    });
                }
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (error as Error).message,
                    timestamp: time(),
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
                        timestamp: time(),
                    });
                return reply.send({
                    code: 200,
                    msg: "获取消息成功",
                    data: data.map((item: UserMessageItem) => ({
                        ...item,
                        createdAt: Date.parse(String(item.createdAt)),
                    })),
                    timestamp: time(),
                });
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (error as Error).message,
                    timestamp: time(),
                });
            }
            return {};
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
                        timestamp: time(),
                    });
                } else {
                    return reply.status(code).send({
                        code: code,
                        msg: json["msg"],
                        timestamp: time(),
                    });
                }
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (error as Error).message,
                    timestamp: time(),
                });
            }
            return {};
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
                            timestamp: time(),
                        });
                    }
                    const data = json.fields[0];
                    if (!data)
                        return reply.status(401).send({
                            code: 401,
                            msg: "账号或密码错误",
                            timestamp: time(),
                        });
                    reply.send({
                        code: 200,
                        msg: "登录成功",
                        id: data.ID,
                        timestamp: time(),
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
                        timestamp: time(),
                    });
                }
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (error as Error).message,
                    timestamp: time(),
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
                    timestamp: time(),
                });
            if (
                decodeURIComponent(email).includes(" ") ||
                decodeURIComponent(nickname).includes(" ") ||
                decodeURIComponent(password).includes(" ")
            )
                return reply.status(400).send({
                    code: 400,
                    msg: "昵称、邮箱和密码不能包含空格字符",
                    timestamp: time(),
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
                        timestamp: time(),
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
                        timestamp: time(),
                    });
                }
            } catch (error: unknown) {
                return reply.status(500).send({
                    code: 500,
                    msg: "服务器内部错误",
                    error: (error as Error).message,
                    timestamp: time(),
                });
            }
            return {};
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
            const r: Response = await fetch(
                "https://www.lihouse.xyz/coco_widget/music_resource/info?key=" +
                    key +
                    "&page=" +
                    page +
                    "&limit=" +
                    limit,
            );
            return await r.json();
        },
    );
    fastify.get(
        "/api/music_resource/id/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
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
            const r: Response = await fetch(
                "http://www.lihouse.xyz/coco_widget/music_resource/id/" + id,
            );
            return await r.json();
        },
    );
}

function time(): number {
    return Date.now();
}

async function lookupIP(ip: string | string[] | null): Promise<string> {
    if (!ip) return "Unknown";
    try {
        const reader = await maxmind.open("./GeoLite2-City.mmdb");
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
