import { jest } from '@jest/globals';

// Mock modules before importing them
const mockListUsers = jest.fn();
const mockContUsers = jest.fn();
const mockGetUserById = jest.fn();
const mockCreateUser = jest.fn();
const mockUpdateUser = jest.fn();
const mockDeleteUser = jest.fn();
const mockParse = jest.fn();
const mockUserIdParse = jest.fn();
const mockBcryptHash = jest.fn();
const mockBcryptCompare = jest.fn();
const mockCreateAccount = jest.fn();

jest.unstable_mockModule('../../repositories/UserRepository.js', () => ({
  default: {
    listUsers: mockListUsers,
    contUsers: mockContUsers,
    getUserById: mockGetUserById,
    createUser: mockCreateUser,
    updateUser: mockUpdateUser,
    deleteUser: mockDeleteUser
  }
}));

jest.unstable_mockModule('../../schemas/UserSchemas.js', () => ({
  default: {
    listUser: { parse: mockParse },
    createUser: { parse: mockParse },
    userIdParam: { parse: mockUserIdParse },
    updateUser: { parse: mockParse },
    changePassword: { parse: mockParse }
  }
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: mockBcryptHash,
    compare: mockBcryptCompare
  }
}));

jest.unstable_mockModule('../../services/AccountService.js', () => ({
  default: {
    createAccount: mockCreateAccount
  }
}));

const { default: UserService } = await import('../../services/UserService.js');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SALT = '10';
  });

  describe('listUsers', () => {
    it('deve listar usuários com valores padrão', async () => {
      mockParse.mockReturnValue({ name: 'Test' });
      mockListUsers.mockResolvedValue([{ id: 1, name: 'Test' }]);
      mockContUsers.mockResolvedValue(1);

      const result = await UserService.listUsers({}, 1, 5);

      expect(result).toEqual({
        usuarios: [{ id: 1, name: 'Test' }],
        total: 1,
        take: 5
      });
      expect(mockListUsers).toHaveBeenCalledWith({ name: 'Test' }, 0, 5, 'asc');
    });

    it('deve converter id para inteiro quando presente', async () => {
      mockParse.mockReturnValue({ id: '10', page: 2, limit: 10 });
      mockListUsers.mockResolvedValue([]);
      mockContUsers.mockResolvedValue(0);

      await UserService.listUsers({ id: '10' }, 2, 10);

      expect(mockListUsers).toHaveBeenCalledWith(
        expect.objectContaining({ id: 10 }),
        10,
        10,
        'asc'
      );
    });

    it('deve lançar erro quando não encontrar usuários', async () => {
      mockParse.mockReturnValue({});
      mockListUsers.mockResolvedValue(null);
      mockContUsers.mockResolvedValue(0);

      await expect(
        UserService.listUsers({}, 1, 5)
      ).rejects.toEqual({ code: 404 });
    });

    it('deve usar order personalizado', async () => {
      mockParse.mockReturnValue({});
      mockListUsers.mockResolvedValue([]);
      mockContUsers.mockResolvedValue(0);

      await UserService.listUsers({}, 1, 5, 'desc');

      expect(mockListUsers).toHaveBeenCalledWith({}, 0, 5, 'desc');
    });
  });

  describe('getUserById', () => {
    it('deve retornar usuário sem senha', async () => {
      mockUserIdParse.mockReturnValue({ id: 1 });
      mockGetUserById.mockResolvedValue({
        id: 1,
        name: 'Test',
        email: 'test@test.com',
        password: 'hashedPassword123'
      });

      const result = await UserService.getUserById(1);

      expect(result).toEqual({
        id: 1,
        name: 'Test',
        email: 'test@test.com'
      });
      expect(result).not.toHaveProperty('password');
    });

    it('deve lançar erro quando usuário não for encontrado', async () => {
      mockUserIdParse.mockReturnValue({ id: 999 });
      mockGetUserById.mockResolvedValue(null);

      await expect(
        UserService.getUserById(999)
      ).rejects.toEqual({ code: 404, message: 'Usuário não encontrado' });
    });
  });

  describe('createUser', () => {
    it('deve criar usuário com senha hasheada e conta padrão', async () => {
      mockParse.mockReturnValue({
        name: 'Test User',
        email: 'test@test.com',
        password: 'Password@123'
      });
      mockBcryptHash.mockResolvedValue('hashedPassword');
      mockCreateUser.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@test.com'
      });
      mockCreateAccount.mockResolvedValue({ id: 1 });

      const result = await UserService.createUser({
        name: 'Test User',
        email: 'test@test.com',
        password: 'Password@123'
      });

      expect(mockBcryptHash).toHaveBeenCalledWith('Password@123', 10);
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedPassword'
      });
      expect(mockCreateAccount).toHaveBeenCalledWith({
        name: 'Carteira',
        type: 'Carteira',
        balance: 0,
        icon: 'uploads/carteira-icon.png',
        paymentMethodIds: [1],
        userId: 1
      });
      expect(result.id).toBe(1);
    });

    it('deve usar SALT do ambiente quando disponível', async () => {
      process.env.SALT = '12';
      mockParse.mockReturnValue({
        name: 'Test',
        email: 'test@test.com',
        password: 'Pass@123'
      });
      mockBcryptHash.mockResolvedValue('hashed');
      mockCreateUser.mockResolvedValue({ id: 1 });
      mockCreateAccount.mockResolvedValue({ id: 1 });

      await UserService.createUser({ password: 'Pass@123' });

      expect(mockBcryptHash).toHaveBeenCalledWith('Pass@123', 12);
    });

    it('deve lançar erro se createUser retornar null', async () => {
      mockParse.mockReturnValue({
        name: 'Test',
        email: 'test@test.com',
        password: 'Pass@123'
      });
      mockBcryptHash.mockResolvedValue('hashed');
      mockCreateUser.mockResolvedValue(null);

      await expect(
        UserService.createUser({ password: 'Pass@123' })
      ).rejects.toEqual({ code: 404 });
    });
  });

  describe('updateUser', () => {
    it('deve atualizar usuário com dados válidos', async () => {
      mockUserIdParse.mockReturnValue({ id: 1 });
      mockParse.mockReturnValue({
        name: 'Updated Name',
        email: 'updated@test.com'
      });
      mockUpdateUser.mockResolvedValue({
        id: 1,
        name: 'Updated Name',
        email: 'updated@test.com'
      });

      const result = await UserService.updateUser(1, {
        name: 'Updated Name',
        email: 'updated@test.com'
      });

      expect(result).toEqual({
        id: 1,
        name: 'Updated Name',
        email: 'updated@test.com'
      });
    });

    it('deve filtrar valores vazios', async () => {
      mockUserIdParse.mockReturnValue({ id: 1 });
      mockParse.mockReturnValue({
        name: '',
        email: 'valid@test.com',
        avatar: null
      });
      mockUpdateUser.mockResolvedValue({ id: 1, email: 'valid@test.com' });

      await UserService.updateUser(1, {
        name: '',
        email: 'valid@test.com',
        avatar: null
      });

      expect(mockUpdateUser).toHaveBeenCalledWith(1, {
        email: 'valid@test.com'
      });
    });

    it('deve lançar erro quando usuário não for encontrado', async () => {
      mockUserIdParse.mockReturnValue({ id: 999 });
      mockParse.mockReturnValue({ name: 'Test' });
      mockUpdateUser.mockResolvedValue(null);

      await expect(
        UserService.updateUser(999, { name: 'Test' })
      ).rejects.toEqual({ code: 404 });
    });
  });

  describe('deleteUser', () => {
    it('deve deletar usuário com sucesso', async () => {
      mockUserIdParse.mockReturnValue({ id: 1 });
      mockDeleteUser.mockResolvedValue({ message: 'Usuário deletado' });

      const result = await UserService.deleteUser(1);

      expect(mockDeleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Usuário deletado' });
    });
  });

  describe('changePassword', () => {
    it('deve alterar senha com sucesso', async () => {
      mockUserIdParse.mockReturnValue({ id: 1 });
      mockParse.mockReturnValue({
        currentPassword: 'OldPass@123',
        newPassword: 'NewPass@456',
        confirmPassword: 'NewPass@456'
      });
      mockGetUserById.mockResolvedValue({
        id: 1,
        password: 'hashedOldPassword'
      });
      mockBcryptCompare.mockResolvedValue(true);
      mockBcryptHash.mockResolvedValue('hashedNewPassword');
      mockUpdateUser.mockResolvedValue({ id: 1 });

      const result = await UserService.changePassword(
        1,
        {
          currentPassword: 'OldPass@123',
          newPassword: 'NewPass@456',
          confirmPassword: 'NewPass@456'
        },
        '1'
      );

      expect(mockBcryptCompare).toHaveBeenCalledWith('OldPass@123', 'hashedOldPassword');
      expect(mockBcryptHash).toHaveBeenCalledWith('NewPass@456', 10);
      expect(mockUpdateUser).toHaveBeenCalledWith(1, { password: 'hashedNewPassword' });
      expect(result).toEqual({ message: 'Senha alterada com sucesso.' });
    });

    it('deve lançar erro quando tentar alterar senha de outro usuário', async () => {
      mockUserIdParse.mockReturnValue({ id: 1 });
      mockParse.mockReturnValue({
        currentPassword: 'Pass@123',
        newPassword: 'NewPass@456'
      });

      await expect(
        UserService.changePassword(
          1,
          { currentPassword: 'Pass@123', newPassword: 'NewPass@456' },
          '2'
        )
      ).rejects.toEqual({
        code: 403,
        message: 'Você só pode alterar sua própria senha.'
      });
    });

    it('deve lançar erro quando usuário não for encontrado', async () => {
      mockUserIdParse.mockReturnValue({ id: 999 });
      mockParse.mockReturnValue({
        currentPassword: 'Pass@123',
        newPassword: 'NewPass@456'
      });
      mockGetUserById.mockResolvedValue(null);

      await expect(
        UserService.changePassword(
          999,
          { currentPassword: 'Pass@123', newPassword: 'NewPass@456' },
          '999'
        )
      ).rejects.toEqual({
        code: 404,
        message: 'Usuário não encontrado.'
      });
    });

    it('deve lançar erro quando senha atual estiver incorreta', async () => {
      mockUserIdParse.mockReturnValue({ id: 1 });
      mockParse.mockReturnValue({
        currentPassword: 'WrongPass@123',
        newPassword: 'NewPass@456'
      });
      mockGetUserById.mockResolvedValue({
        id: 1,
        password: 'hashedPassword'
      });
      mockBcryptCompare.mockResolvedValue(false);

      await expect(
        UserService.changePassword(
          1,
          { currentPassword: 'WrongPass@123', newPassword: 'NewPass@456' },
          '1'
        )
      ).rejects.toEqual({
        code: 401,
        message: 'Senha atual incorreta.'
      });
    });
  });
});
