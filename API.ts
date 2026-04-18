import type { FastifyInstance, FastifyReply, FastifyRequest, FastifyError } from "fastify";
import type { GetByIDResponse, SearchResponse, UserData } from "./types.ts";
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
                const json: SearchResponse = await user.search(keyword);
                const code: number = json["code"];
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
