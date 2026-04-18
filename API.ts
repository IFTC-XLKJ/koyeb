import type { FastifyInstance, FastifyReply, FastifyRequest, FastifyError } from "fastify";
import { GetByIDResponse, UserData } from "./types.ts";
import User from "./User.ts";

const user = new User();

interface UserDetailsQueryParams {
    id: number;
}

export default function (fastify: FastifyInstance) {
    console.log("defining API routes...");
    fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
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
    });
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
            return { message: "Hello, World!" };
        },
    );
}

function time(): number {
    return Date.now();
}
