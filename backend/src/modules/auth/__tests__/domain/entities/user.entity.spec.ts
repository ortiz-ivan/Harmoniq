import { User } from '../../../domain/entities/user.entity';

describe('User Entity', () => {
  it('should create a user instance correctly', () => {
    const user = new User(
      '1',
      'spotify123',
      'Test User',
      'test@example.com',
      'access-token',
      'refresh-token'
    );

    expect(user.id).toBe('1');
    expect(user.spotifyId).toBe('spotify123');
    expect(user.displayName).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.accessToken).toBe('access-token');
    expect(user.refreshToken).toBe('refresh-token');
  });
});
