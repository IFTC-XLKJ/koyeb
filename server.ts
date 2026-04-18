import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
const fastify: FastifyInstance = Fastify({
    logger: true,
});

const port: number = Number(process.env.PORT) || 3000;

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply): Promise<Object> => {
    return { hello: "world" };
});

fastify.listen({ port: port }, (err: Error | null, address: String): void => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
