import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

interface UserDetailsQueryParams {
    id: number;
}

export default function (fastify: FastifyInstance) {
    console.log("defining API routes...");
    fastify.get(
        "/api/user/details",
        async (
            request: FastifyRequest<{ Querystring: UserDetailsQueryParams }>,
            reply: FastifyReply,
        ): Promise<Object> => {
            const { id } = request.query;
            console.log(id, typeof id);
            return { message: "Hello, World!" };
        },
    );
}
