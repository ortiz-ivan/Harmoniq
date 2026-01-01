import jwt from 'jsonwebtoken';
import { TokenGeneratorService } from '../../../domain/services/token-generator.service';

describe('TokenGeneratorService', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should generate a JWT token with userId', () => {
    const token = TokenGeneratorService.generate('123');
    expect(typeof token).toBe('string');

    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    expect((payload as any).userId).toBe('123');
  });
});
