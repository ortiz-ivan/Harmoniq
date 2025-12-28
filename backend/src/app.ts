import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import { authRoutes } from "./modules/auth/infrastructure/controllers/auth.controller";
import { matchRoutes } from "./modules/matching"; // importando desde index.ts

export const buildApp = () => {
  const app = Fastify({ logger: true });

  // CORS
  app.register(cors, { origin: true });

  // ENV CONFIG (antes de las rutas)
  app.register(fastifyEnv, {
    dotenv: true,
    schema: {
      type: "object",
      required: [
        "SPOTIFY_CLIENT_ID",
        "SPOTIFY_CLIENT_SECRET",
        "SPOTIFY_REDIRECT_URI",
      ],
      properties: {
        SPOTIFY_CLIENT_ID: { type: "string" },
        SPOTIFY_CLIENT_SECRET: { type: "string" },
        SPOTIFY_REDIRECT_URI: { type: "string" },
      },
    },
  });

  // Healthcheck
  app.get("/health", async () => ({ status: "ok" }));

  // Routes
  app.register(authRoutes);
  app.register(matchRoutes, { prefix: "/matching" }); // registrar con prefijo

  return app;
};
