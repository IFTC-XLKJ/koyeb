import Fastify, { FastifyInstance } from "fastify";
const fastify: FastifyInstance = Fastify({
    logger: true,
});

const port: number = Number(process.env.PORT) || 3000;

fastify.get("/", async (request, reply) => {
    return { hello: "world" };
});

fastify.listen({ port: port }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
