// modules/auth/__tests__/application/use-cases/spotify-login.usecase.spec.ts
import { SpotifyLoginUseCase } from '../../../application/use-cases/spotify-login.usecase';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import jwt from 'jsonwebtoken';
import { mockSpotifyAuthService } from '../../domain/services/spotify-auth.service.mock';

describe('SpotifyLoginUseCase', () => {
  let useCase: SpotifyLoginUseCase;

  // Mock del repositorio, definido dentro del test
  const mockUserRepository: jest.Mocked<IUserRepository> = {
    findBySpotifyId: jest.fn(),
    create: jest.fn(),
    updateTokens: jest.fn(),
  };

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SpotifyLoginUseCase(mockUserRepository, mockSpotifyAuthService);
  });

  it('should create a new user if not exists', async () => {
    mockUserRepository.findBySpotifyId.mockResolvedValue(null);
    mockUserRepository.create.mockImplementation(async (user: User) => user);

    const result = await useCase.execute('dummy-code');

    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.updateTokens).not.toHaveBeenCalled();

    expect(result.user.displayName).toBe('Mock User');
    expect(result.token).toBeDefined();

    const payload = jwt.verify(result.token, process.env.JWT_SECRET!);
    expect((payload as any).userId).toBe('spotify123');
  });

  it('should update tokens if user exists', async () => {
    const existingUser = new User(
      'internal-id',
      'spotify123',
      'Existing User',
      'exist@example.com',
      'old-access',
      'old-refresh'
    );

    mockUserRepository.findBySpotifyId.mockResolvedValue(existingUser);

    const result = await useCase.execute('dummy-code');

    expect(mockUserRepository.updateTokens).toHaveBeenCalledWith(
      'internal-id',
      'mock-access-token',
      'mock-refresh-token'
    );
    expect(mockUserRepository.create).not.toHaveBeenCalled();

    expect(result.user.displayName).toBe('Existing User');
    expect(result.token).toBeDefined();

    const payload = jwt.verify(result.token, process.env.JWT_SECRET!);
    expect((payload as any).userId).toBe('internal-id');
  });
});
