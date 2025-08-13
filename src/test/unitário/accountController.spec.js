import { jest, describe, it, beforeEach, expect } from '@jest/globals';

describe('AccountController Unit Tests', () => {
  let AccountController;
  let mockAccountService;
  let mockAccountSchemas;
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(async () => {
    jest.resetModules();
    
    mockAccountService = {
      listAccounts: jest.fn(),
      createAccount: jest.fn(),
      updateAccount: jest.fn(),
      deleteAccount: jest.fn()
    };

    mockAccountSchemas = {
      listAccountUser: { parse: jest.fn() },
      createAccountBody: { parse: jest.fn() },
      createAccountQuery: { parse: jest.fn() }
    };

    jest.unstable_mockModule('../../services/AccountService.js', () => ({
      default: mockAccountService
    }));

    jest.unstable_mockModule('../../schemas/AccountsSchemas.js', () => ({
      default: mockAccountSchemas
    }));

    const { default: AccountControllerImport } = await import('../../controllers/AccountController.js');
    AccountController = AccountControllerImport;

    mockRequest = {
      body: {},
      query: {},
      file: undefined,
      params: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('listAllAccountsAdmin', () => {
    it('should list all accounts for admin with pagination', async () => {
      const query = { page: '1', limit: '10' };
      const accounts = [
        { id: 1, name: 'Conta 1', type: 'Corrente', balance: 1000 },
        { id: 2, name: 'Conta 2', type: 'Poupança', balance: 2000 }
      ];
      const total = 2;
      const take = 10;

      mockRequest.query = query;
      mockAccountService.listAccounts.mockResolvedValue({ contas: accounts, total, take });

      await AccountController.listAllAccountsAdmin(mockRequest, mockResponse, mockNext);

      expect(mockAccountService.listAccounts).toHaveBeenCalledWith(query, 'desc');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle errors properly in listAllAccountsAdmin', async () => {
      const error = { code: 500, message: 'Internal server error' };
      
      mockRequest.query = {};
      mockAccountService.listAccounts.mockRejectedValue(error);

      await AccountController.listAllAccountsAdmin(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should use default page 1 when page is not provided', async () => {
      const query = {};
      const accounts = [{ id: 1, name: 'Conta 1' }];
      
      mockRequest.query = query;
      mockAccountService.listAccounts.mockResolvedValue({ contas: accounts, total: 1, take: 10 });

      await AccountController.listAllAccountsAdmin(mockRequest, mockResponse, mockNext);

      // Verifica se a página padrão 1 foi usada na resposta
      const responseCall = mockResponse.json.mock.calls[0][0];
      expect(responseCall).toMatchObject({
        page: 1,
        data: accounts,
        total: 1,
        limite: 10
      });
    });
  });

  describe('listAllAccountsUser', () => {
    it('should list accounts for specific user with validation', async () => {
      const query = { userId: '1', page: '1', limit: '10' };
      const validatedQuery = { userId: 1, page: 1, limit: 10 };
      const accounts = [
        { id: 1, name: 'Minha Conta', type: 'Corrente', balance: 1500, userId: 1 }
      ];

      mockRequest.query = query;
      mockAccountSchemas.listAccountUser.parse.mockReturnValue(validatedQuery);
      mockAccountService.listAccounts.mockResolvedValue({ contas: accounts, total: 1, take: 10 });

      await AccountController.listAllAccountsUser(mockRequest, mockResponse, mockNext);

      expect(mockAccountSchemas.listAccountUser.parse).toHaveBeenCalledWith(query);
      expect(mockAccountService.listAccounts).toHaveBeenCalledWith(validatedQuery, 'desc');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle validation errors in listAllAccountsUser', async () => {
      const query = { userId: 'invalid' };
      const validationError = new Error('Invalid userId');

      mockRequest.query = query;
      mockAccountSchemas.listAccountUser.parse.mockImplementation(() => {
        throw validationError;
      });

      await AccountController.listAllAccountsUser(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(validationError);
    });
  });

  describe('registerAccount - Icon handling', () => {
    it('should create account with icon when file is uploaded', async () => {
      const bodyData = {
        name: 'Nova Conta',
        type: 'Corrente',
        balance: 1000,
        paymentMethodIds: '1,2'
      };
      const queryData = { userId: '1' };
      const mockFile = {
        filename: 'account-icon.png'
      };
      const validatedBody = {
        name: 'Nova Conta',
        type: 'Corrente',
        balance: 1000,
        paymentMethodIds: [1, 2]
      };
      const validatedQuery = { userId: 1 };
      const createdAccount = {
        id: 1,
        name: 'Nova Conta',
        type: 'Corrente',
        balance: 1000,
        icon: 'uploads/account-icon.png',
        userId: 1
      };

      mockRequest.body = bodyData;
      mockRequest.query = queryData;
      mockRequest.file = mockFile;
      mockAccountSchemas.createAccountBody.parse.mockReturnValue(validatedBody);
      mockAccountSchemas.createAccountQuery.parse.mockReturnValue(validatedQuery);
      mockAccountService.createAccount.mockResolvedValue(createdAccount);

      await AccountController.registerAccount(mockRequest, mockResponse, mockNext);

      expect(mockAccountSchemas.createAccountBody.parse).toHaveBeenCalledWith(bodyData);
      expect(mockAccountSchemas.createAccountQuery.parse).toHaveBeenCalledWith(queryData);
      expect(mockAccountService.createAccount).toHaveBeenCalledWith({
        name: 'Nova Conta',
        type: 'Corrente',
        balance: 1000,
        icon: 'uploads/account-icon.png',
        paymentMethodIds: [1, 2],
        userId: 1
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should create account without icon when no file is uploaded', async () => {
      const bodyData = {
        name: 'Nova Conta',
        type: 'Poupança',
        balance: 2000,
        paymentMethodIds: ''
      };
      const queryData = { userId: '1' };
      const validatedBody = {
        name: 'Nova Conta',
        type: 'Poupança',
        balance: 2000,
        paymentMethodIds: []
      };
      const validatedQuery = { userId: 1 };
      const createdAccount = {
        id: 1,
        name: 'Nova Conta',
        type: 'Poupança',
        balance: 2000,
        icon: '',
        userId: 1
      };

      mockRequest.body = bodyData;
      mockRequest.query = queryData;
      mockRequest.file = undefined;
      mockAccountSchemas.createAccountBody.parse.mockReturnValue(validatedBody);
      mockAccountSchemas.createAccountQuery.parse.mockReturnValue(validatedQuery);
      mockAccountService.createAccount.mockResolvedValue(createdAccount);

      await AccountController.registerAccount(mockRequest, mockResponse, mockNext);

      expect(mockAccountService.createAccount).toHaveBeenCalledWith({
        name: 'Nova Conta',
        type: 'Poupança',
        balance: 2000,
        icon: '',
        paymentMethodIds: [],
        userId: 1
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should handle account creation errors', async () => {
      const bodyData = { name: 'Conta', type: 'Corrente', balance: 1000 };
      const queryData = { userId: '1' };
      const error = { code: 409, message: 'Account already exists' };

      mockRequest.body = bodyData;
      mockRequest.query = queryData;
      mockAccountSchemas.createAccountBody.parse.mockReturnValue(bodyData);
      mockAccountSchemas.createAccountQuery.parse.mockReturnValue({ userId: 1 });
      mockAccountService.createAccount.mockRejectedValue(error);

      await AccountController.registerAccount(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateAccount', () => {
    it('should update account with new icon when file is uploaded', async () => {
      const queryData = { id: '1', userId: '1' };
      const bodyData = {
        name: 'Conta Atualizada',
        type: 'Poupança',
        balance: 3000,
        paymentMethodIds: '1,3'
      };
      const mockFile = {
        filename: 'new-icon.png'
      };
      const updatedAccount = {
        id: 1,
        name: 'Conta Atualizada',
        type: 'Poupança',
        balance: 3000,
        icon: 'uploads/new-icon.png'
      };

      mockRequest.query = queryData;
      mockRequest.body = bodyData;
      mockRequest.file = mockFile;
      mockAccountService.updateAccount.mockResolvedValue(updatedAccount);

      await AccountController.updateAccount(mockRequest, mockResponse, mockNext);

      expect(mockAccountService.updateAccount).toHaveBeenCalledWith(
        1, // id
        1, // userId
        {
          name: 'Conta Atualizada',
          type: 'Poupança',
          balance: 3000,
          paymentMethodIds: '1,3',
          icon: 'uploads/new-icon.png'
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should update account without changing icon when no file is uploaded', async () => {
      const queryData = { id: '1', userId: '1' };
      const bodyData = {
        name: 'Conta Atualizada',
        balance: 2500,
        icon: 'old-icon.png'
      };
      const updatedAccount = {
        id: 1,
        name: 'Conta Atualizada',
        balance: 2500,
        icon: 'old-icon.png'
      };

      mockRequest.query = queryData;
      mockRequest.body = bodyData;
      mockRequest.file = undefined;
      mockAccountService.updateAccount.mockResolvedValue(updatedAccount);

      await AccountController.updateAccount(mockRequest, mockResponse, mockNext);

      expect(mockAccountService.updateAccount).toHaveBeenCalledWith(
        1, // id
        1, // userId
        {
          name: 'Conta Atualizada',
          balance: 2500,
          icon: 'old-icon.png'
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should filter out empty/null values in update', async () => {
      const queryData = { id: '1', userId: '1' };
      const bodyData = {
        name: 'Conta Válida',
        type: '',  // empty string - should be filtered
        balance: null,  // null - should be filtered
        paymentMethodIds: '   '  // whitespace - should be filtered
      };
      const updatedAccount = { id: 1, name: 'Conta Válida' };

      mockRequest.query = queryData;
      mockRequest.body = bodyData;
      mockRequest.file = undefined;
      mockAccountService.updateAccount.mockResolvedValue(updatedAccount);

      await AccountController.updateAccount(mockRequest, mockResponse, mockNext);

      expect(mockAccountService.updateAccount).toHaveBeenCalledWith(
        1, // id
        1, // userId
        {
          name: 'Conta Válida'
          // Outros campos filtrados por serem vazios/nulos
        }
      );
    });

    it('should handle update errors', async () => {
      const queryData = { id: '999', userId: '1' };
      const bodyData = { name: 'Conta' };
      const error = { code: 404, message: 'Account not found' };

      mockRequest.query = queryData;
      mockRequest.body = bodyData;
      mockAccountService.updateAccount.mockRejectedValue(error);

      await AccountController.updateAccount(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const queryData = { id: '1', userId: '1' };
      const deleteResult = { message: 'Conta deletada com sucesso' };

      mockRequest.query = queryData;
      mockAccountService.deleteAccount.mockResolvedValue(deleteResult);

      await AccountController.deleteAccount(mockRequest, mockResponse, mockNext);

      expect(mockAccountService.deleteAccount).toHaveBeenCalledWith('1', '1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle delete errors', async () => {
      const queryData = { id: '999', userId: '1' };
      const error = { code: 404, message: 'Account not found' };

      mockRequest.query = queryData;
      mockAccountService.deleteAccount.mockRejectedValue(error);

      await AccountController.deleteAccount(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

});
