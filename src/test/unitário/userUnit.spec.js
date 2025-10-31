import { jest, describe, it, beforeEach, expect } from '@jest/globals';

describe('UserController Unit Tests - Avatar Handling', () => {
  let UserController;
  let mockUserService;
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(async () => {
    jest.resetModules();
    
    mockUserService = {
      createUser: jest.fn(),
      updateUser: jest.fn()
    };

    jest.unstable_mockModule('../../services/UserService.js', () => ({
      default: mockUserService
    }));

    const { default: UserControllerImport } = await import('../../controllers/UserController.js');
    UserController = UserControllerImport;

    mockRequest = {
      body: {},
      file: undefined,
      params: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('registerUser - Avatar handling (line 32)', () => {
    it('should create user with avatar path when file is uploaded', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'TestPassword@123'
      };
      
      const mockFile = {
        path: 'uploads/avatar123.jpg'
      };

      const createdUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        avatar: 'uploads/avatar123.jpg'
      };

      mockRequest.body = userData;
      mockRequest.file = mockFile;
      mockUserService.createUser.mockResolvedValue(createdUser);

      await UserController.registerUser(mockRequest, mockResponse, mockNext);

      expect(mockUserService.createUser).toHaveBeenCalledWith({
        ...userData,
        avatar: 'uploads/avatar123.jpg'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should create user without avatar when no file is uploaded', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'TestPassword@123'
      };

      const createdUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        avatar: null
      };

      mockRequest.body = userData;
      mockRequest.file = undefined; // No file uploaded
      mockUserService.createUser.mockResolvedValue(createdUser);

      await UserController.registerUser(mockRequest, mockResponse, mockNext);

      expect(mockUserService.createUser).toHaveBeenCalledWith({
        ...userData,
        avatar: null
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateUser - Avatar handling (line 56)', () => {
    it('should update user with new avatar path when file is uploaded', async () => {
      const userId = '1';
      const updateData = {
        name: 'Updated User',
        email: 'updated@test.com'
      };
      
      const mockFile = {
        path: 'uploads/new-avatar456.jpg'
      };

      const updatedUser = {
        id: 1,
        name: 'Updated User',
        email: 'updated@test.com',
        avatar: 'uploads/new-avatar456.jpg'
      };

      mockRequest.params = { id: userId };
      mockRequest.body = updateData;
      mockRequest.file = mockFile;
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      await UserController.updateUser(mockRequest, mockResponse, mockNext);

      expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, {
        ...updateData,
        avatar: 'uploads/new-avatar456.jpg'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should update user without changing avatar when no file is uploaded', async () => {
      const userId = '1';
      const updateData = {
        name: 'Updated User',
        email: 'updated@test.com',
        avatar: 'old-avatar.jpg'
      };

      const updatedUser = {
        id: 1,
        name: 'Updated User',
        email: 'updated@test.com',
        avatar: 'old-avatar.jpg'
      };

      mockRequest.params = { id: userId };
      mockRequest.body = updateData;
      mockRequest.file = undefined; // No file uploaded
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      await UserController.updateUser(mockRequest, mockResponse, mockNext);

      expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, {
        ...updateData,
        avatar: 'old-avatar.jpg'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors properly', async () => {
      const userId = '1';
      const updateData = {
        name: 'Updated User'
      };

      const error = { code: 404, message: 'User not found' };

      mockRequest.params = { id: userId };
      mockRequest.body = updateData;
      mockRequest.file = undefined;
      mockUserService.updateUser.mockRejectedValue(error);

      await UserController.updateUser(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

});
