import { IUserRepository } from "../../domain/repositories/user.repository";
import { SpotifyAdapter } from "../../infrastructure/adapters/spotify.adapter";
import { User } from "../../domain/entities/user.entity";
import { TokenGeneratorService } from "../../domain/services/token-generator.service";

export class SpotifyLoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(code: string): Promise<{ token: string; user: User }> {
    const tokenResponse = await SpotifyAdapter.getToken(
      code,
      process.env.SPOTIFY_REDIRECT_URI!,
      process.env.SPOTIFY_CLIENT_ID!,
      process.env.SPOTIFY_CLIENT_SECRET!
    );

    const profile = await SpotifyAdapter.getUserProfile(tokenResponse.access_token);

    let user = await this.userRepository.findBySpotifyId(profile.id);

    if (!user) {
      user = await this.userRepository.create(
        new User(profile.id, profile.id, profile.display_name, profile.email, tokenResponse.access_token, tokenResponse.refresh_token)
      );
    } else {
      await this.userRepository.updateTokens(user.id, tokenResponse.access_token, tokenResponse.refresh_token);
    }

    const jwtToken = TokenGeneratorService.generate(user.id);

    return { token: jwtToken, user };
  }
}
