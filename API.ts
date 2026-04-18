import type { FastifyInstance, FastifyReply, FastifyRequest, FastifyError } from "fastify";
import type { GetByIDResponse, SearchResponse, UserData, UserLoginResponse } from "./types.ts";
import User from "./User.ts";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { StorageClient } from "@supabase/storage-js";
import { PostgrestClient } from "@supabase/postgrest-js";

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
                    return reply.send({
                        code: 200,
                        msg: "登录成功",
                        id: data.ID,
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
}

function time(): number {
    return Date.now();
}
