export interface ISpotifyAuthService {
  getToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;

  getUserProfile(accessToken: string): Promise<{
    id: string;
    displayName: string;
    email: string;
  }>;
}
