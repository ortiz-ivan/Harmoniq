import axios from "axios";
import { ISpotifyAuthService } from "../../domain/services/spotify-auth.service";

const SPOTIFY_TOKEN_API = "https://accounts.spotify.com/api/token";
const SPOTIFY_ME_API = "https://api.spotify.com/v1/me";

export class SpotifyAuthAdapter implements ISpotifyAuthService {

  async getToken(code: string) {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.SPOTIFY_REDIRECT_URI!);

    const response = await axios.post(SPOTIFY_TOKEN_API, params, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  }

  async getUserProfile(accessToken: string) {
    const response = await axios.get(SPOTIFY_ME_API, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      id: response.data.id,
      displayName: response.data.display_name,
      email: response.data.email,
    };
  }
}
