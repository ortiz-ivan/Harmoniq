import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { SpotifyLoginUseCase } from "../../application/use-cases/spotify-login.usecase";

export function createAuthController(
  loginUseCase: SpotifyLoginUseCase
) {
  return async function authRoutes(app: FastifyInstance) {
    // Redirige a Spotify para login
    app.get("/auth/login", async (_req, reply) => {
  const state = crypto.randomUUID();

  reply.setCookie("spotify_auth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: "user-read-email",
    state,
  });

  return reply.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
});

    // Callback de Spotify
    app.get("/auth/callback", async (req, reply) => {
  const { code, state } = req.query as { code: string; state: string };

  const storedState = req.cookies.spotify_auth_state;

  if (!state || state !== storedState) {
    return reply.status(400).send({ error: "Invalid OAuth state" });
  }

  const { token, user } = await loginUseCase.execute(code);
  reply.send({ token, user });
});
  };
}
