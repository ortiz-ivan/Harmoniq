// src/modules/auth/__tests__/infrastructure/controllers/auth.controller.spec.ts
import Fastify from 'fastify';
import request from 'supertest';
import cookie from '@fastify/cookie';
import { createAuthController } from '../../../infrastructure/controllers/auth.controller';
import { SpotifyLoginUseCase } from '../../../application/use-cases/spotify-login.usecase';
import { User } from '../../../domain/entities/user.entity';

describe('AuthController', () => {
  let app: any;
  let loginUseCase: jest.Mocked<SpotifyLoginUseCase>;

  beforeEach(async () => {
    app = Fastify();
    await app.register(cookie);

    loginUseCase = {
      execute: jest.fn(),
    } as any;

    await createAuthController(loginUseCase)(app);
    await app.ready();

    process.env.SPOTIFY_CLIENT_ID = 'client-id';
    process.env.SPOTIFY_REDIRECT_URI = 'http://localhost/callback';
  });

  afterEach(() => app.close());

  it('should redirect to Spotify auth page', async () => {
    const response = await request(app.server).get('/auth/login');

    expect(response.status).toBe(302);
    expect(response.headers.location).toContain('accounts.spotify.com/authorize');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should reject invalid OAuth state', async () => {
    const response = await request(app.server)
      .get('/auth/callback')
      .query({ code: 'code', state: 'invalid' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid OAuth state');
  });

  it('should return token and user on successful login', async () => {
    loginUseCase.execute.mockResolvedValue({
      token: 'jwt-token',
      user: new User (
        '1',
        'spotify123',
        'Test',
        'test@example.com',
        'access-token',
        'refresh-token'
      ),
    });

    const response = await request(app.server)
      .get('/auth/callback')
      .set('Cookie', ['spotify_auth_state=valid'])
      .query({ code: 'code', state: 'valid' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe('jwt-token');
    expect(loginUseCase.execute).toHaveBeenCalledWith('code');
  });
});
