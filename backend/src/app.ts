import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifyCookie from "@fastify/cookie";

import { authController } from "./modules/auth";
import { matchRoutes } from "./modules/matching";

export const buildApp = () => {
  const app = Fastify({ logger: true });

  // CORS
  app.register(cors, { origin: true });

  // ENV CONFIG
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
        COOKIE_SECRET: { type: "string" },
      },
    },
  });

  // COOKIES 
  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  // Healthcheck
  app.get("/health", async () => ({ status: "ok" }));

  // Routes
  app.register(authController);
  app.register(matchRoutes, { prefix: "/matching" });

  return app;
};
