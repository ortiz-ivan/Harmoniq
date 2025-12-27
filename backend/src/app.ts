import fastify from "fastify";
import cors from "@fastify/cors"

export const buildApp = () => {
    const app = fastify({
        logger: true,
    });

    app.register(cors, {
        origin: true,
    });

    app.get("/health", async () => {
        return { status: "ok"};
    });

    return app;
}