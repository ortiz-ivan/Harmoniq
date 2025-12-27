import { buildApp } from "./app";


const start = async () => {
    const app = buildApp();

    try {
        await app.listen({ port: 3000, host: "0.0.0.0" });
        console.log("Server runnig on http://127.0.0.1:3000/health");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();