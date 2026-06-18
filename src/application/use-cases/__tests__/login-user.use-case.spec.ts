import { LoginUserUseCase } from '../login-user.use-case';
import { LoginUserInput } from '../../dtos/login-user.input';
import { makeUser } from './helpers/domain-factories';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let mockUserRepository: any;
  let mockPasswordEncoder: any;
  let mockJwtTokenProvider: any;

  beforeEach(() => {
    // Arrange
    mockUserRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      existsByEmail: jest.fn(),
    };

    mockPasswordEncoder = {
      hash: jest.fn(),
      verify: jest.fn(),
    };

    mockJwtTokenProvider = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
    };

    useCase = new LoginUserUseCase(
      mockUserRepository,
      mockPasswordEncoder,
      mockJwtTokenProvider,
    );
  });

  describe('should_return_token_when_credentials_are_valid', () => {
    it('should return token and user data', async () => {
      // Arrange
      const input = new LoginUserInput();
      input.email = 'user@example.com';
      input.password = 'password123';

      const user = makeUser('user@example.com', 'testuser');
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockPasswordEncoder.verify.mockResolvedValue(true);
      mockJwtTokenProvider.generateToken.mockReturnValue('jwt_token_123');

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.token).toBe('jwt_token_123');
      expect(output.username).toBe('testuser');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockPasswordEncoder.verify).toHaveBeenCalledTimes(1);
    });
  });

  describe('should_throw_error_when_user_not_found', () => {
    it('should throw error for non-existent email', async () => {
      // Arrange
      const input = new LoginUserInput();
      input.email = 'nonexistent@example.com';
      input.password = 'password123';

      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockPasswordEncoder.verify).not.toHaveBeenCalled();
    });
  });

  describe('should_throw_error_when_password_is_incorrect', () => {
    it('should throw error for wrong password', async () => {
      // Arrange
      const input = new LoginUserInput();
      input.email = 'user@example.com';
      input.password = 'wrongpassword';

      const user = makeUser('user@example.com', 'testuser');
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockPasswordEncoder.verify.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockJwtTokenProvider.generateToken).not.toHaveBeenCalled();
    });
  });

  describe('should_throw_error_when_email_format_is_invalid', () => {
    it('should throw error for invalid email', async () => {
      // Arrange
      const input = new LoginUserInput();
      input.email = 'not-an-email';
      input.password = 'password123';

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });
  });
});
