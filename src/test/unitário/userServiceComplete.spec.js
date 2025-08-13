import { jest, describe, it, beforeEach, expect } from '@jest/globals';

describe('UserService Unit Tests', () => {
  let UserService;
  let mockUserRepository;
  let mockUserSchemas;
  let mockBcrypt;

  beforeEach(async () => {
    // Reset all mocks
    jest.resetModules();
    
    // Create mocks
    mockUserRepository = {
      listUsers: jest.fn(),
      contUsers: jest.fn(),
      getUserById: jest.fn(),
      createUser: jest.fn(),
      createUserAdmin: jest.fn(),
      updateUser: jest.fn(),
      updateUserAdmin: jest.fn(),
      deleteUser: jest.fn()
    };

    mockUserSchemas = {
      listUser: { parse: jest.fn() },
      userIdParam: { parse: jest.fn() },
      createUser: { parse: jest.fn() },
      createUserAdmin: { parse: jest.fn() },
      updateUser: { parse: jest.fn() },
      updateUserAdmin: { parse: jest.fn() },
      changePassword: { parse: jest.fn() }
    };

    mockBcrypt = {
      hash: jest.fn(),
      compare: jest.fn()
    };

    // Mock the modules
    jest.unstable_mockModule('../../repositories/UserRepository.js', () => ({
      default: mockUserRepository
    }));

    jest.unstable_mockModule('../../schemas/UserSchemas.js', () => ({
      default: mockUserSchemas
    }));

    jest.unstable_mockModule('bcryptjs', () => ({
      default: mockBcrypt,
      hash: mockBcrypt.hash,
      compare: mockBcrypt.compare
    }));

    // Import the service after mocking
    const { default: UserServiceImport } = await import('../../services/UserService.js');
    UserService = UserServiceImport;
  });

  describe('listUsers', () => {
    it('should list users with valid filters and pagination', async () => {
      const filtros = { name: 'test' };
      const page = 1;
      const limit = 10;
      const order = 'asc';
      const validFiltros = { name: 'test' };
      const usuarios = [{ id: 1, name: 'test', email: 'test@test.com' }];
      const total = 1;

      mockUserSchemas.listUser.parse.mockReturnValue(validFiltros);
      mockUserRepository.listUsers.mockResolvedValue(usuarios);
      mockUserRepository.contUsers.mockResolvedValue(total);

      const result = await UserService.listUsers(filtros, page, limit, order);

      expect(mockUserSchemas.listUser.parse).toHaveBeenCalledWith(filtros);
      expect(mockUserRepository.listUsers).toHaveBeenCalledWith(validFiltros, 0, 10, order);
      expect(mockUserRepository.contUsers).toHaveBeenCalledWith(validFiltros);
      expect(result).toEqual({ usuarios, total, take: 10 });
    });

    it('should throw error if no users found', async () => {
      const filtros = { name: 'test' };
      const page = 1;
      const limit = 10;
      const validFiltros = { name: 'test' };

      mockUserSchemas.listUser.parse.mockReturnValue(validFiltros);
      mockUserRepository.listUsers.mockResolvedValue(null);
      mockUserRepository.contUsers.mockResolvedValue(0);

      await expect(UserService.listUsers(filtros, page, limit)).rejects.toEqual({ code: 404 });
    });

    it('should convert id to integer when provided', async () => {
      const filtros = { id: '1' };
      const page = 1;
      const limit = 10;
      const validFiltros = { id: '1' };
      const usuarios = [{ id: 1, name: 'test', email: 'test@test.com' }];
      const total = 1;

      mockUserSchemas.listUser.parse.mockReturnValue(validFiltros);
      mockUserRepository.listUsers.mockResolvedValue(usuarios);
      mockUserRepository.contUsers.mockResolvedValue(total);

      await UserService.listUsers(filtros, page, limit);

      expect(mockUserRepository.listUsers).toHaveBeenCalledWith({ id: 1 }, 0, 10, 'asc');
    });
  });

  describe('getUserById', () => {
    it('should return user by id without password', async () => {
      const id = 1;
      const validId = { id: 1 };
      const user = { 
        id: 1, 
        name: 'Test User', 
        email: 'test@test.com', 
        password: 'hashedPassword',
        avatar: null,
        isAdmin: false
      };
      const userWithoutPassword = { 
        id: 1, 
        name: 'Test User', 
        email: 'test@test.com', 
        avatar: null,
        isAdmin: false
      };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserRepository.getUserById.mockResolvedValue(user);

      const result = await UserService.getUserById(id);

      expect(mockUserSchemas.userIdParam.parse).toHaveBeenCalledWith({ id });
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(validId.id);
      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw error if user not found', async () => {
      const id = 1;
      const validId = { id: 1 };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserRepository.getUserById.mockResolvedValue(null);

      await expect(UserService.getUserById(id)).rejects.toEqual({ 
        code: 404, 
        message: "Usuário não encontrado" 
      });
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      process.env.SALT = '10';
    });

    it('should create a new user with hashed password', async () => {
      const userData = { 
        name: 'Test User', 
        email: 'test@test.com', 
        password: 'TestPassword@123',
        avatar: null 
      };
      const validUserData = { 
        name: 'Test User', 
        email: 'test@test.com', 
        password: 'TestPassword@123',
        avatar: null 
      };
      const hashedPassword = 'hashedPassword';
      const userWithHashedPassword = {
        ...validUserData,
        password: hashedPassword
      };
      const createdUser = { 
        id: 1, 
        name: 'Test User', 
        email: 'test@test.com',
        avatar: null,
        isAdmin: false
      };

      mockUserSchemas.createUser.parse.mockReturnValue(validUserData);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.createUser.mockResolvedValue(createdUser);

      const result = await UserService.createUser(userData);

      expect(mockUserSchemas.createUser.parse).toHaveBeenCalledWith(userData);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(userWithHashedPassword);
      expect(result).toEqual(createdUser);
    });

    it('should throw error if user creation fails', async () => {
      const userData = { 
        name: 'Test User', 
        email: 'test@test.com', 
        password: 'TestPassword@123' 
      };
      const validUserData = { 
        name: 'Test User', 
        email: 'test@test.com', 
        password: 'TestPassword@123' 
      };
      const hashedPassword = 'hashedPassword';

      mockUserSchemas.createUser.parse.mockReturnValue(validUserData);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.createUser.mockResolvedValue(null);

      await expect(UserService.createUser(userData)).rejects.toEqual({ code: 404 });
    });

    it('should use default salt if not in environment', async () => {
      delete process.env.SALT;
      
      const userData = { 
        name: 'Test User', 
        email: 'test@test.com', 
        password: 'TestPassword@123' 
      };
      const validUserData = { 
        name: 'Test User', 
        email: 'test@test.com', 
        password: 'TestPassword@123' 
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = { id: 1, name: 'Test User' };

      mockUserSchemas.createUser.parse.mockReturnValue(validUserData);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.createUser.mockResolvedValue(createdUser);

      await UserService.createUser(userData);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
    });
  });

  describe('createUserAdmin', () => {
    beforeEach(() => {
      process.env.SALT = '10';
    });

    it('should create a new admin user with hashed password', async () => {
      const userData = { 
        name: 'Admin User', 
        email: 'admin@test.com', 
        password: 'AdminPassword@123',
        avatar: null,
        isAdmin: true
      };
      const validUserData = { 
        name: 'Admin User', 
        email: 'admin@test.com', 
        password: 'AdminPassword@123',
        avatar: null,
        isAdmin: true
      };
      const hashedPassword = 'hashedPassword';
      const userWithHashedPassword = {
        ...validUserData,
        password: hashedPassword
      };
      const createdUser = { 
        id: 1, 
        name: 'Admin User', 
        email: 'admin@test.com',
        avatar: null,
        isAdmin: true
      };

      mockUserSchemas.createUserAdmin.parse.mockReturnValue(validUserData);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.createUserAdmin.mockResolvedValue(createdUser);

      const result = await UserService.createUserAdmin(userData);

      expect(mockUserSchemas.createUserAdmin.parse).toHaveBeenCalledWith(userData);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
      expect(mockUserRepository.createUserAdmin).toHaveBeenCalledWith(userWithHashedPassword);
      expect(result).toEqual(createdUser);
    });

    it('should throw error if admin user creation fails', async () => {
      const userData = { 
        name: 'Admin User', 
        email: 'admin@test.com', 
        password: 'AdminPassword@123',
        isAdmin: true
      };
      const validUserData = { 
        name: 'Admin User', 
        email: 'admin@test.com', 
        password: 'AdminPassword@123',
        isAdmin: true
      };
      const hashedPassword = 'hashedPassword';

      mockUserSchemas.createUserAdmin.parse.mockReturnValue(validUserData);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.createUserAdmin.mockResolvedValue(null);

      await expect(UserService.createUserAdmin(userData)).rejects.toEqual({ code: 404 });
    });

    // Teste para cobrir linha 90 do UserRepository - email já existe no createUserAdmin
    it('should handle email already exists error in createUserAdmin', async () => {
      const userData = { 
        name: 'Admin User', 
        email: 'existing@test.com', 
        password: 'AdminPassword@123',
        isAdmin: true
      };
      const validUserData = { 
        name: 'Admin User', 
        email: 'existing@test.com', 
        password: 'AdminPassword@123',
        isAdmin: true
      };
      const hashedPassword = 'hashedPassword';
      const emailError = { code: 409, message: "Email já cadastrado" };

      mockUserSchemas.createUserAdmin.parse.mockReturnValue(validUserData);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.createUserAdmin.mockRejectedValue(emailError);

      await expect(UserService.createUserAdmin(userData)).rejects.toEqual(emailError);
    });
  });

  describe('updateUser', () => {
    it('should update user with filtered data', async () => {
      const id = 1;
      const userData = { 
        name: 'Updated Name', 
        email: 'updated@test.com',
        avatar: 'new-avatar.jpg',
        emptyField: ''
      };
      const validId = { id: 1 };
      const validUserData = { 
        name: 'Updated Name', 
        email: 'updated@test.com',
        avatar: 'new-avatar.jpg',
        emptyField: ''
      };
      const filteredData = { 
        name: 'Updated Name', 
        email: 'updated@test.com',
        avatar: 'new-avatar.jpg'
      };
      const updatedUser = { 
        id: 1, 
        name: 'Updated Name', 
        email: 'updated@test.com',
        avatar: 'new-avatar.jpg'
      };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.updateUser.parse.mockReturnValue(validUserData);
      mockUserRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser(id, userData);

      expect(mockUserSchemas.userIdParam.parse).toHaveBeenCalledWith({ id });
      expect(mockUserSchemas.updateUser.parse).toHaveBeenCalledWith(userData);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(validId.id, filteredData);
      expect(result).toEqual(updatedUser);
    });

    it('should throw error if user update fails', async () => {
      const id = 1;
      const userData = { name: 'Updated Name' };
      const validId = { id: 1 };
      const validUserData = { name: 'Updated Name' };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.updateUser.parse.mockReturnValue(validUserData);
      mockUserRepository.updateUser.mockResolvedValue(null);

      await expect(UserService.updateUser(id, userData)).rejects.toEqual({ code: 404 });
    });

    it('should filter out null, undefined and empty string values', async () => {
      const id = 1;
      const userData = { 
        name: 'Updated Name',
        email: null,
        avatar: undefined,
        emptyField: ''
      };
      const validId = { id: 1 };
      const validUserData = { 
        name: 'Updated Name',
        email: null,
        avatar: undefined,
        emptyField: ''
      };
      const filteredData = { name: 'Updated Name' };
      const updatedUser = { id: 1, name: 'Updated Name' };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.updateUser.parse.mockReturnValue(validUserData);
      mockUserRepository.updateUser.mockResolvedValue(updatedUser);

      await UserService.updateUser(id, userData);

      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(validId.id, filteredData);
    });
  });

  describe('updateUserAdmin', () => {
    it('should update user with admin privileges', async () => {
      const id = 1;
      const userData = { 
        name: 'Updated Admin', 
        email: 'admin@test.com',
        isAdmin: true
      };
      const validId = { id: 1 };
      const validUserData = { 
        name: 'Updated Admin', 
        email: 'admin@test.com',
        isAdmin: true
      };
      const filteredData = { 
        name: 'Updated Admin', 
        email: 'admin@test.com',
        isAdmin: true
      };
      const updatedUser = { 
        id: 1, 
        name: 'Updated Admin', 
        email: 'admin@test.com',
        isAdmin: true
      };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.updateUserAdmin.parse.mockReturnValue(validUserData);
      mockUserRepository.updateUserAdmin.mockResolvedValue(updatedUser);

      const result = await UserService.updateUserAdmin(id, userData);

      expect(mockUserSchemas.userIdParam.parse).toHaveBeenCalledWith({ id });
      expect(mockUserSchemas.updateUserAdmin.parse).toHaveBeenCalledWith(userData);
      expect(mockUserRepository.updateUserAdmin).toHaveBeenCalledWith(validId.id, filteredData);
      expect(result).toEqual(updatedUser);
    });

    // Teste para cobrir linha 115 do UserService - updateUserAdmin retorna null
    it('should throw error if admin user update fails', async () => {
      const id = 1;
      const userData = { name: 'Updated Admin' };
      const validId = { id: 1 };
      const validUserData = { name: 'Updated Admin' };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.updateUserAdmin.parse.mockReturnValue(validUserData);
      mockUserRepository.updateUserAdmin.mockResolvedValue(null);

      await expect(UserService.updateUserAdmin(id, userData)).rejects.toEqual({ code: 404 });
    });

    // Teste para cobrir linha 169 do UserRepository - usuário não existe no updateUserAdmin
    it('should handle user not found error in updateUserAdmin', async () => {
      const id = 1;
      const userData = { name: 'Updated Admin' };
      const validId = { id: 1 };
      const validUserData = { name: 'Updated Admin' };
      const userNotFoundError = { code: 404, message: "Usuário não encontrado" };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.updateUserAdmin.parse.mockReturnValue(validUserData);
      mockUserRepository.updateUserAdmin.mockRejectedValue(userNotFoundError);

      await expect(UserService.updateUserAdmin(id, userData)).rejects.toEqual(userNotFoundError);
    });

    // Teste para cobrir linha 181 do UserRepository - email já existe em outro usuário no updateUserAdmin
    it('should handle email already exists error in updateUserAdmin', async () => {
      const id = 1;
      const userData = { 
        name: 'Updated Admin', 
        email: 'existing@test.com',
        isAdmin: true
      };
      const validId = { id: 1 };
      const validUserData = { 
        name: 'Updated Admin', 
        email: 'existing@test.com',
        isAdmin: true
      };
      const emailError = { code: 409, message: "Email já cadastrado por outro usuário" };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.updateUserAdmin.parse.mockReturnValue(validUserData);
      mockUserRepository.updateUserAdmin.mockRejectedValue(emailError);

      await expect(UserService.updateUserAdmin(id, userData)).rejects.toEqual(emailError);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const id = 1;
      const validId = { id: 1 };
      const deleteResult = { message: "Usuário deletado com sucesso" };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserRepository.deleteUser.mockResolvedValue(deleteResult);

      const result = await UserService.deleteUser(id);

      expect(mockUserSchemas.userIdParam.parse).toHaveBeenCalledWith({ id });
      expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(validId.id);
      expect(result).toEqual(deleteResult);
    });

    // Teste para cobrir linhas 247-248 do UserRepository - catch block no deleteUser
    it('should handle delete error and rethrow', async () => {
      const id = 1;
      const validId = { id: 1 };
      const deleteError = new Error("Database connection failed");

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserRepository.deleteUser.mockRejectedValue(deleteError);

      await expect(UserService.deleteUser(id)).rejects.toEqual(deleteError);
    });
  });

  describe('changePassword', () => {
    beforeEach(() => {
      process.env.SALT = '10';
    });

    it('should change password successfully', async () => {
      const id = 1;
      const passwordData = { 
        currentPassword: 'oldPassword', 
        newPassword: 'NewPassword@123',
        confirmPassword: 'NewPassword@123'
      };
      const requestingUserId = 1;
      const validId = { id: 1 };
      const validPasswordData = { 
        currentPassword: 'oldPassword', 
        newPassword: 'NewPassword@123',
        confirmPassword: 'NewPassword@123'
      };
      const user = { 
        id: 1, 
        name: 'Test User', 
        email: 'test@test.com',
        password: 'hashedOldPassword'
      };
      const hashedNewPassword = 'hashedNewPassword';
      const updateResult = { message: "Senha alterada com sucesso." };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.changePassword.parse.mockReturnValue(validPasswordData);
      mockUserRepository.getUserById.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(true);
      mockBcrypt.hash.mockResolvedValue(hashedNewPassword);
      mockUserRepository.updateUser.mockResolvedValue({ id: 1, name: 'Test User' });

      const result = await UserService.changePassword(id, passwordData, requestingUserId);

      expect(mockUserSchemas.userIdParam.parse).toHaveBeenCalledWith({ id });
      expect(mockUserSchemas.changePassword.parse).toHaveBeenCalledWith(passwordData);
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(validId.id);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(validPasswordData.currentPassword, user.password);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(validPasswordData.newPassword, 10);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(validId.id, { password: hashedNewPassword });
      expect(result).toEqual({ message: "Senha alterada com sucesso." });
    });

    it('should throw error if user tries to change another user password', async () => {
      const id = 1;
      const passwordData = { 
        currentPassword: 'oldPassword', 
        newPassword: 'NewPassword@123',
        confirmPassword: 'NewPassword@123'
      };
      const requestingUserId = 2; // Different user
      const validId = { id: 1 };
      const validPasswordData = { 
        currentPassword: 'oldPassword', 
        newPassword: 'NewPassword@123',
        confirmPassword: 'NewPassword@123'
      };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.changePassword.parse.mockReturnValue(validPasswordData);

      await expect(UserService.changePassword(id, passwordData, requestingUserId))
        .rejects.toEqual({ 
          code: 403, 
          message: "Você só pode alterar sua própria senha." 
        });
    });

    it('should throw error if user not found', async () => {
      const id = 1;
      const passwordData = { 
        currentPassword: 'oldPassword', 
        newPassword: 'NewPassword@123',
        confirmPassword: 'NewPassword@123'
      };
      const requestingUserId = 1;
      const validId = { id: 1 };
      const validPasswordData = { 
        currentPassword: 'oldPassword', 
        newPassword: 'NewPassword@123',
        confirmPassword: 'NewPassword@123'
      };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.changePassword.parse.mockReturnValue(validPasswordData);
      mockUserRepository.getUserById.mockResolvedValue(null);

      await expect(UserService.changePassword(id, passwordData, requestingUserId))
        .rejects.toEqual({ 
          code: 404, 
          message: "Usuário não encontrado." 
        });
    });

    it('should throw error if current password is incorrect', async () => {
      const id = 1;
      const passwordData = { 
        currentPassword: 'wrongPassword', 
        newPassword: 'NewPassword@123',
        confirmPassword: 'NewPassword@123'
      };
      const requestingUserId = 1;
      const validId = { id: 1 };
      const validPasswordData = { 
        currentPassword: 'wrongPassword', 
        newPassword: 'NewPassword@123',
        confirmPassword: 'NewPassword@123'
      };
      const user = { 
        id: 1, 
        name: 'Test User', 
        email: 'test@test.com',
        password: 'hashedOldPassword'
      };

      mockUserSchemas.userIdParam.parse.mockReturnValue(validId);
      mockUserSchemas.changePassword.parse.mockReturnValue(validPasswordData);
      mockUserRepository.getUserById.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(UserService.changePassword(id, passwordData, requestingUserId))
        .rejects.toEqual({ 
          code: 401, 
          message: "Senha atual incorreta." 
        });
    });
  });

});
