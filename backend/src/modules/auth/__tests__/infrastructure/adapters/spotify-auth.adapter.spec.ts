// src/modules/auth/__tests__/infrastructure/adapters/spotify-auth.adapter.spec.ts
import axios from 'axios';
import { SpotifyAuthAdapter } from '../../../infrastructure/adapters/spotify-auth.adapter';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SpotifyAuthAdapter', () => {
  const adapter = new SpotifyAuthAdapter();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SPOTIFY_CLIENT_ID = 'client-id';
    process.env.SPOTIFY_CLIENT_SECRET = 'client-secret';
    process.env.SPOTIFY_REDIRECT_URI = 'http://localhost/callback';
  });

  it('should get access and refresh token from Spotify', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      },
    } as any);

    const result = await adapter.getToken('auth-code');

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    expect(mockedAxios.post).toHaveBeenCalled();
  });

  it('should get user profile from Spotify', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        id: 'spotify123',
        display_name: 'Test User',
        email: 'test@example.com',
      },
    } as any);

    const result = await adapter.getUserProfile('access-token');

    expect(result).toEqual({
      id: 'spotify123',
      displayName: 'Test User',
      email: 'test@example.com',
    });

    expect(mockedAxios.get).toHaveBeenCalled();
  });
});
