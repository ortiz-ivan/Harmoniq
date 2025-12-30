import { IUserRepository } from "../../domain/repositories/user.repository";
import { ISpotifyAuthService } from "../../domain/services/spotify-auth.service";
import { User } from "../../domain/entities/user.entity";
import { TokenGeneratorService } from "../../domain/services/token-generator.service";

export class SpotifyLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private spotifyAuthService: ISpotifyAuthService
  ) {}

  async execute(code: string): Promise<{ token: string; user: User }> {
    // 1. Obtener tokens desde el servicio de dominio
    const { accessToken, refreshToken } =
      await this.spotifyAuthService.getToken(code);

    // 2. Obtener perfil del usuario desde el servicio de dominio
    const profile =
      await this.spotifyAuthService.getUserProfile(accessToken);

    // 3. Buscar usuario por Spotify ID
    let user = await this.userRepository.findBySpotifyId(profile.id);

    // 4. Crear o actualizar usuario
    if (!user) {
      user = await this.userRepository.create(
        new User(
          profile.id,          // id interno 
          profile.id,          // spotifyId
          profile.displayName,
          profile.email,
          accessToken,
          refreshToken
        )
      );
    } else {
      await this.userRepository.updateTokens(
        user.id,
        accessToken,
        refreshToken
      );
    }

    // 5. Generar JWT propio del sistema
    const jwtToken = TokenGeneratorService.generate(user.id);

    return { token: jwtToken, user };
  }
}
