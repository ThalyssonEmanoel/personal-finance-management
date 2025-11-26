import { jest } from '@jest/globals';

// Mock modules
const mockLogin = jest.fn();
const mockUpdateTokens = jest.fn();
const mockRemoveTokens = jest.fn();
const mockValidateRefreshToken = jest.fn();
const mockFindByEmail = jest.fn();
const mockParse = jest.fn();
const mockJwtSign = jest.fn();
const mockJwtVerify = jest.fn();

jest.unstable_mockModule('../../repositories/AuthRepository.js', () => ({
  default: {
    login: mockLogin,
    updateTokens: mockUpdateTokens,
    removeTokens: mockRemoveTokens,
    validateRefreshToken: mockValidateRefreshToken,
  }
}));

jest.unstable_mockModule('../../repositories/UserRepository.js', () => ({
  default: {
    findByEmail: mockFindByEmail,
  }
}));

jest.unstable_mockModule('../../schemas/authSchema.js', () => ({
  default: {
    login: { parse: mockParse },
    logout: { parse: mockParse },
    refreshToken: { parse: mockParse },
    revokeToken: { parse: mockParse },
  }
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: mockJwtSign,
    verify: mockJwtVerify,
  }
}));

const { default: AuthService } = await import('../../services/AuthService.js');

describe('AuthService - Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRATION_ACCESS_TOKEN = '15m';
    process.env.JWT_EXPIRATION_REFRESH_TOKEN = '7d';
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas e retornar tokens', async () => {
      const loginData = {
        email: 'user@test.com',
        password: 'Password@123'
      };

      const usuario = {
        id: 1,
        name: 'Test User',
        email: 'user@test.com',
        senha: 'hashedPassword'
      };

      mockParse.mockReturnValue(loginData);
      mockLogin.mockResolvedValue(usuario);
      mockJwtSign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');
      mockUpdateTokens.mockResolvedValue(undefined);

      const result = await AuthService.login(loginData);

      expect(mockParse).toHaveBeenCalledWith(loginData);
      expect(mockLogin).toHaveBeenCalledWith(loginData.email, loginData.password);
      expect(mockJwtSign).toHaveBeenCalledWith(
        {
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
        },
        'test-secret',
        { expiresIn: '15m' }
      );
      expect(mockJwtSign).toHaveBeenCalledWith(
        {
          id: usuario.id,
          email: usuario.email,
        },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(mockUpdateTokens).toHaveBeenCalledWith(usuario.id, 'mock-refresh-token');
      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        usuario: {
          id: 1,
          name: 'Test User',
          email: 'user@test.com'
        }
      });
      expect(result.usuario).not.toHaveProperty('senha');
    });

    it('deve usar valores padrão de expiração quando variáveis de ambiente não estão definidas', async () => {
      delete process.env.JWT_EXPIRATION_ACCESS_TOKEN;
      delete process.env.JWT_EXPIRATION_REFRESH_TOKEN;

      mockParse.mockReturnValue({
        email: 'user@test.com',
        password: 'Password@123'
      });
      mockLogin.mockResolvedValue({
        id: 1,
        name: 'Test',
        email: 'user@test.com'
      });
      mockJwtSign.mockReturnValue('token');
      mockUpdateTokens.mockResolvedValue(undefined);

      await AuthService.login({
        email: 'user@test.com',
        password: 'Password@123'
      });

      expect(mockJwtSign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String),
        { expiresIn: '15m' }
      );
      expect(mockJwtSign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String),
        { expiresIn: '7d' }
      );
    });

    it('deve lançar erro quando email não é fornecido', async () => {
      const loginData = {
        password: 'Password@123'
      };

      mockParse.mockReturnValue(loginData);

      await expect(
        AuthService.login(loginData)
      ).rejects.toEqual({
        code: 400,
        message: 'Email e senha são obrigatórios.'
      });
    });

    it('deve lançar erro quando senha não é fornecida', async () => {
      const loginData = {
        email: 'user@test.com'
      };

      mockParse.mockReturnValue(loginData);

      await expect(
        AuthService.login(loginData)
      ).rejects.toEqual({
        code: 400,
        message: 'Email e senha são obrigatórios.'
      });
    });

    it('deve propagar erro quando credenciais são inválidas', async () => {
      mockParse.mockReturnValue({
        email: 'user@test.com',
        password: 'wrongPassword'
      });
      mockLogin.mockRejectedValue({
        code: 401,
        message: 'Email ou senha inválidos.'
      });

      await expect(
        AuthService.login({
          email: 'user@test.com',
          password: 'wrongPassword'
        })
      ).rejects.toEqual({
        code: 401,
        message: 'Email ou senha inválidos.'
      });
    });
  });

  describe('logout', () => {
    it('deve fazer logout com sucesso', async () => {
      const userId = '1';
      mockParse.mockReturnValue({ id: userId });
      mockRemoveTokens.mockResolvedValue(undefined);

      await AuthService.logout(userId);

      expect(mockParse).toHaveBeenCalledWith({ id: userId });
      expect(mockRemoveTokens).toHaveBeenCalledWith(userId);
    });

    it('deve lançar erro quando ID não é fornecido', async () => {
      await expect(
        AuthService.logout(null)
      ).rejects.toEqual({
        code: 400,
        message: 'ID do usuário é obrigatório.'
      });
    });

    it('deve lançar erro quando ID é vazio', async () => {
      await expect(
        AuthService.logout('')
      ).rejects.toEqual({
        code: 400,
        message: 'ID do usuário é obrigatório.'
      });
    });

    it('deve propagar erro do repositório', async () => {
      mockParse.mockReturnValue({ id: '999' });
      mockRemoveTokens.mockRejectedValue({
        code: 404,
        message: 'Usuário não encontrado'
      });

      await expect(
        AuthService.logout('999')
      ).rejects.toEqual({
        code: 404,
        message: 'Usuário não encontrado'
      });
    });
  });

  describe('refreshToken', () => {
    it('deve gerar novo access token mantendo o refresh token', async () => {
      const refreshTokenData = {
        refreshToken: 'valid-refresh-token'
      };

      const decodedToken = {
        id: 1,
        email: 'user@test.com'
      };

      const usuario = {
        id: 1,
        name: 'Test User',
        email: 'user@test.com'
      };

      mockParse.mockReturnValue(refreshTokenData);
      mockJwtVerify.mockReturnValue(decodedToken);
      mockValidateRefreshToken.mockResolvedValue(usuario);
      mockJwtSign.mockReturnValue('new-access-token');

      const result = await AuthService.refreshToken(refreshTokenData);

      expect(mockParse).toHaveBeenCalledWith(refreshTokenData);
      expect(mockJwtVerify).toHaveBeenCalledWith('valid-refresh-token', 'test-secret');
      expect(mockValidateRefreshToken).toHaveBeenCalledWith(1, 'valid-refresh-token');
      expect(mockJwtSign).toHaveBeenCalledWith(
        {
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
        },
        'test-secret',
        { expiresIn: '15m' }
      );
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'valid-refresh-token'
      });
    });

    it('deve usar valor padrão de expiração quando variável de ambiente não está definida', async () => {
      delete process.env.JWT_EXPIRATION_ACCESS_TOKEN;

      mockParse.mockReturnValue({ refreshToken: 'token' });
      mockJwtVerify.mockReturnValue({ id: 1 });
      mockValidateRefreshToken.mockResolvedValue({
        id: 1,
        name: 'Test',
        email: 'test@test.com'
      });
      mockJwtSign.mockReturnValue('new-token');

      await AuthService.refreshToken({ refreshToken: 'token' });

      expect(mockJwtSign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String),
        { expiresIn: '15m' }
      );
    });

    it('deve lançar erro quando refresh token é inválido', async () => {
      mockParse.mockReturnValue({ refreshToken: 'invalid-token' });
      mockJwtVerify.mockImplementation(() => {
        const error = new Error('jwt malformed');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      await expect(
        AuthService.refreshToken({ refreshToken: 'invalid-token' })
      ).rejects.toEqual({
        code: 401,
        message: 'Refresh token inválido ou expirado.'
      });
    });

    it('deve lançar erro quando refresh token está expirado', async () => {
      mockParse.mockReturnValue({ refreshToken: 'expired-token' });
      mockJwtVerify.mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await expect(
        AuthService.refreshToken({ refreshToken: 'expired-token' })
      ).rejects.toEqual({
        code: 401,
        message: 'Refresh token inválido ou expirado.'
      });
    });

    it('deve lançar erro quando usuário não é encontrado', async () => {
      mockParse.mockReturnValue({ refreshToken: 'valid-token' });
      mockJwtVerify.mockReturnValue({ id: 999 });
      mockValidateRefreshToken.mockRejectedValue({
        code: 404,
        message: 'Usuário não encontrado.'
      });

      await expect(
        AuthService.refreshToken({ refreshToken: 'valid-token' })
      ).rejects.toEqual({
        code: 404,
        message: 'Usuário não encontrado.'
      });
    });

    it('deve lançar erro quando refresh token não corresponde ao do usuário', async () => {
      mockParse.mockReturnValue({ refreshToken: 'token-1' });
      mockJwtVerify.mockReturnValue({ id: 1 });
      mockValidateRefreshToken.mockRejectedValue({
        code: 401,
        message: 'Refresh token inválido.'
      });

      await expect(
        AuthService.refreshToken({ refreshToken: 'token-1' })
      ).rejects.toEqual({
        code: 401,
        message: 'Refresh token inválido.'
      });
    });

    it('deve propagar outros erros não relacionados ao JWT', async () => {
      mockParse.mockReturnValue({ refreshToken: 'token' });
      mockJwtVerify.mockImplementation(() => {
        throw new Error('Erro desconhecido');
      });

      await expect(
        AuthService.refreshToken({ refreshToken: 'token' })
      ).rejects.toThrow('Erro desconhecido');
    });
  });

  describe('revokeToken', () => {
    it('deve revogar token com sucesso', async () => {
      const userData = { userId: 1 };
      mockParse.mockReturnValue(userData);
      mockRemoveTokens.mockResolvedValue(undefined);

      await AuthService.revokeToken(userData);

      expect(mockParse).toHaveBeenCalledWith(userData);
      expect(mockRemoveTokens).toHaveBeenCalledWith(1);
    });

    it('deve validar userId como número inteiro positivo', async () => {
      const userData = { userId: 5 };
      mockParse.mockReturnValue(userData);
      mockRemoveTokens.mockResolvedValue(undefined);

      await AuthService.revokeToken(userData);

      expect(mockRemoveTokens).toHaveBeenCalledWith(5);
    });

    it('deve propagar erro quando usuário não é encontrado', async () => {
      mockParse.mockReturnValue({ userId: 999 });
      mockRemoveTokens.mockRejectedValue({
        code: 404,
        message: 'Usuário não encontrado'
      });

      await expect(
        AuthService.revokeToken({ userId: 999 })
      ).rejects.toEqual({
        code: 404,
        message: 'Usuário não encontrado'
      });
    });

    it('deve propagar erro quando usuário já está sem refresh token', async () => {
      mockParse.mockReturnValue({ userId: 1 });
      mockRemoveTokens.mockRejectedValue({
        code: 401,
        message: 'Usuário já está sem refresh token'
      });

      await expect(
        AuthService.revokeToken({ userId: 1 })
      ).rejects.toEqual({
        code: 401,
        message: 'Usuário já está sem refresh token'
      });
    });
  });
});
