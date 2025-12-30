import { FastifyInstance } from "fastify";
import { SpotifyLoginUseCase } from "../../application/use-cases/spotify-login.usecase";
import { ISpotifyAuthService } from "../../domain/services/spotify-auth.service";

export function createAuthController(
  loginUseCase: SpotifyLoginUseCase
) {
  return async function authRoutes(app: FastifyInstance) {
    // Redirige a Spotify para login
    app.get("/auth/login", async (_req, reply) => {
      const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        scope: "user-read-email",
      });

      const url = `https://accounts.spotify.com/authorize?${params.toString()}`;
      return reply.redirect(url);
    });

    // Callback de Spotify
    app.get("/auth/callback", async (req, reply) => {
      const { code } = req.query as { code: string };
      const { token, user } = await loginUseCase.execute(code);
      reply.send({ token, user });
    });
  };
}
