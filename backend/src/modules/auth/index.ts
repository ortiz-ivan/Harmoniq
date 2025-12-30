import { SpotifyLoginUseCase } from "./application/use-cases/spotify-login.usecase";
import { SpotifyAuthAdapter } from "./infrastructure/adapters/spotify-auth.adapter";
import { PrismaUserRepository } from "./infrastructure/repositories/prisma-user.repository";
import { createAuthController } from "./infrastructure/controllers/auth.controller";

// Infrastructure
const userRepository = new PrismaUserRepository();
const spotifyAuthService = new SpotifyAuthAdapter();

// Application
const loginUseCase = new SpotifyLoginUseCase(userRepository, spotifyAuthService);

// Controller
const authController = createAuthController(loginUseCase);

export { authController };
