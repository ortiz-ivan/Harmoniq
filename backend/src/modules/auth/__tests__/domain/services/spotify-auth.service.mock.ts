import { ISpotifyAuthService } from '../../../domain/services/spotify-auth.service';

export const mockSpotifyAuthService: ISpotifyAuthService = {
  getToken: jest.fn().mockResolvedValue({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  }),
  getUserProfile: jest.fn().mockResolvedValue({
    id: 'spotify123',
    displayName: 'Mock User',
    email: 'mock@example.com',
  }),
};
