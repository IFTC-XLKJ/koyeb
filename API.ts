import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

interface UserDetailsQueryParams {
    id: number;
}

export default function (fastify: FastifyInstance) {
    console.log("defining API routes...");
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
            if (Number.isNaN(Number(id)))
                return reply.status(200).send({
                    code: 400,
                    msg: "id参数类型错误，必须为数值类型",
                    timestamp: time(),
                });
            return { message: "Hello, World!" };
        },
    );
}

function time(): number {
    return Date.now();
}