import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
const fastify: FastifyInstance = Fastify({
    logger: true,
});

const port: number = Number(process.env.PORT) || 3000;

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: "world" };
});

fastify.listen({ port: port }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
