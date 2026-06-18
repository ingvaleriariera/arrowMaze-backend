import { RegisterUserUseCase } from '../register-user.use-case';
import { RegisterUserInput } from '../../dtos/register-user.input';
import { Email } from '../../../domain/value-objects/email.vo';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: any;
  let mockPasswordEncoder: any;
  let mockJwtTokenProvider: any;

  beforeEach(() => {
    // Arrange
    mockUserRepository = {
      save: jest.fn().mockResolvedValue(undefined),
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

    useCase = new RegisterUserUseCase(
      mockUserRepository,
      mockPasswordEncoder,
      mockJwtTokenProvider,
    );
  });

  describe('should_return_token_when_registration_is_successful', () => {
    it('should return token and user data', async () => {
      // Arrange
      const input = new RegisterUserInput();
      input.email = 'newuser@example.com';
      input.username = 'newuser';
      input.password = 'password123';

      mockUserRepository.existsByEmail.mockResolvedValue(false);
      mockPasswordEncoder.hash.mockResolvedValue('hashed_password');
      mockJwtTokenProvider.generateToken.mockReturnValue('jwt_token_123');

      // Act
      const output = await useCase.execute(input);

      // Assert
      expect(output.token).toBe('jwt_token_123');
      expect(output.username).toBe('newuser');
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockJwtTokenProvider.generateToken).toHaveBeenCalledWith(
        expect.any(String),
        'player',
      );
    });
  });

  describe('should_throw_error_when_email_already_exists', () => {
    it('should throw error for duplicate email', async () => {
      // Arrange
      const input = new RegisterUserInput();
      input.email = 'existing@example.com';
      input.username = 'newuser';
      input.password = 'password123';

      mockUserRepository.existsByEmail.mockResolvedValue(true);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Email already registered',
      );
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('should_throw_error_when_email_format_is_invalid', () => {
    it('should throw error for invalid email', async () => {
      // Arrange
      const input = new RegisterUserInput();
      input.email = 'not-an-email';
      input.username = 'newuser';
      input.password = 'password123';

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
      expect(mockUserRepository.existsByEmail).not.toHaveBeenCalled();
    });
  });

  describe('should_throw_error_when_username_is_invalid', () => {
    it('should throw error when username is too short', async () => {
      // Arrange
      const input = new RegisterUserInput();
      input.email = 'user@example.com';
      input.username = 'ab'; // Too short
      input.password = 'password123';

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });
  });

  describe('should_throw_error_when_password_is_invalid', () => {
    it('should throw error when password is too short', async () => {
      // Arrange
      const input = new RegisterUserInput();
      input.email = 'user@example.com';
      input.username = 'testuser';
      input.password = '12345'; // Too short

      mockUserRepository.existsByEmail.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });
  });
});
