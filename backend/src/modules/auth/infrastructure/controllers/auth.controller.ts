import { FastifyInstance } from "fastify";
import { SpotifyLoginUseCase } from "../../application/use-cases/spotify-login.usecase";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { PrismaUserRepository } from "../repositories/prisma-user.repository";

export async function authRoutes(app: FastifyInstance) {
    const userRepo: IUserRepository = new PrismaUserRepository();
    const loginUseCase = new SpotifyLoginUseCase(userRepo);

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


    app.get("/auth/callback", async (req, reply) => {
        const { code } = req.query as { code: string };
        const { token, user } = await loginUseCase.execute(code);
        reply.send({ token, user })
    })
}