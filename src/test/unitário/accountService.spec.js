import { jest, describe, it, beforeEach, expect } from '@jest/globals';

describe('AccountService Unit Tests', () => {
  let AccountService;
  let mockAccountRepository;
  let mockAccountSchemas;

  beforeEach(async () => {
    jest.resetModules();
    
    mockAccountRepository = {
      listAccounts: jest.fn(),
      contAccounts: jest.fn(),
      getAccountById: jest.fn(),
      createAccount: jest.fn(),
      updateAccount: jest.fn(),
      deleteAccount: jest.fn()
    };

    mockAccountSchemas = {
      listAccount: { parse: jest.fn() },
      accountIdParam: { parse: jest.fn() },
      userIdParam: { parse: jest.fn() },
      createAccount: { parse: jest.fn() },
      updateAccount: { parse: jest.fn() }
    };

    jest.unstable_mockModule('../../repositories/AccountRepository.js', () => ({
      default: mockAccountRepository
    }));

    jest.unstable_mockModule('../../schemas/AccountsSchemas.js', () => ({
      default: mockAccountSchemas
    }));

    const { default: AccountServiceImport } = await import('../../services/AccountService.js');
    AccountService = AccountServiceImport;
  });

  describe('listAccounts', () => {
    it('should list accounts with valid filters and pagination', async () => {
      const filtros = { name: 'Conta', userId: '1', page: 1, limit: 10 };
      const order = 'asc';
      const validFiltros = { name: 'Conta', userId: '1', page: 1, limit: 10 };
      const accounts = [
        { id: 1, name: 'Conta 1', type: 'Corrente', balance: 1000 },
        { id: 2, name: 'Conta 2', type: 'Poupança', balance: 2000 }
      ];
      const total = 2;

      mockAccountSchemas.listAccount.parse.mockReturnValue(validFiltros);
      mockAccountRepository.listAccounts.mockResolvedValue(accounts);
      mockAccountRepository.contAccounts.mockResolvedValue(total);

      const result = await AccountService.listAccounts(filtros, order);

      expect(mockAccountSchemas.listAccount.parse).toHaveBeenCalledWith(filtros);
      expect(mockAccountRepository.listAccounts).toHaveBeenCalledWith(
        { name: 'Conta', userId: '1' }, // filtros sem page/limit (id não incluído pois não estava nos filtros originais)
        0, // skip
        10, // take
        order
      );
      expect(mockAccountRepository.contAccounts).toHaveBeenCalled();
      expect(result).toEqual({ contas: accounts, total, take: 10 });
    });

    it('should use default pagination when not provided', async () => {
      const filtros = { name: 'Conta' };
      const validFiltros = { name: 'Conta' };
      const accounts = [{ id: 1, name: 'Conta 1' }];
      const total = 1;

      mockAccountSchemas.listAccount.parse.mockReturnValue(validFiltros);
      mockAccountRepository.listAccounts.mockResolvedValue(accounts);
      mockAccountRepository.contAccounts.mockResolvedValue(total);

      const result = await AccountService.listAccounts(filtros);

      expect(mockAccountRepository.listAccounts).toHaveBeenCalledWith(
        { name: 'Conta' },
        0, // skip (page 1 - 1) * limit 10
        10, // take default limit
        'asc' // default order
      );
      expect(result).toEqual({ contas: accounts, total, take: 10 });
    });

    it('should convert id to integer when provided', async () => {
      const filtros = { id: '5', name: 'Conta' };
      const validFiltros = { id: '5', name: 'Conta' };
      const accounts = [{ id: 5, name: 'Conta 5' }];
      const total = 1;

      mockAccountSchemas.listAccount.parse.mockReturnValue(validFiltros);
      mockAccountRepository.listAccounts.mockResolvedValue(accounts);
      mockAccountRepository.contAccounts.mockResolvedValue(total);

      await AccountService.listAccounts(filtros);

      expect(mockAccountRepository.listAccounts).toHaveBeenCalledWith(
        { id: 5, name: 'Conta' }, // id convertido para integer
        0,
        10,
        'asc'
      );
    });

    it('should calculate correct skip value for pagination', async () => {
      const filtros = { page: 3, limit: 5 };
      const validFiltros = { page: 3, limit: 5 };
      const accounts = [{ id: 1, name: 'Conta' }];
      const total = 1;

      mockAccountSchemas.listAccount.parse.mockReturnValue(validFiltros);
      mockAccountRepository.listAccounts.mockResolvedValue(accounts);
      mockAccountRepository.contAccounts.mockResolvedValue(total);

      await AccountService.listAccounts(filtros);

      expect(mockAccountRepository.listAccounts).toHaveBeenCalledWith(
        {}, // sem page/limit nos filtros de DB
        10, // skip = (3 - 1) * 5
        5, // take = limit
        'asc'
      );
    });
  });

  describe('getAccountById', () => {
    it('should return account by id when found', async () => {
      const id = 1;
      const validId = { id: 1 };
      const account = {
        id: 1,
        name: 'Minha Conta',
        type: 'Corrente',
        balance: 1500,
        icon: 'icon.png',
        userId: 1
      };

      mockAccountSchemas.accountIdParam.parse.mockReturnValue(validId);
      mockAccountRepository.getAccountById.mockResolvedValue(account);

      const result = await AccountService.getAccountById(id);

      expect(mockAccountSchemas.accountIdParam.parse).toHaveBeenCalledWith({ id });
      expect(mockAccountRepository.getAccountById).toHaveBeenCalledWith(validId.id);
      expect(result).toEqual(account);
    });

    it('should throw error if account not found', async () => {
      const id = 999;
      const validId = { id: 999 };

      mockAccountSchemas.accountIdParam.parse.mockReturnValue(validId);
      mockAccountRepository.getAccountById.mockResolvedValue(null);

      await expect(AccountService.getAccountById(id)).rejects.toEqual({
        code: 404,
        message: "Conta não encontrada"
      });
    });
  });

  describe('createAccount', () => {
    it('should create a new account successfully', async () => {
      const accountData = {
        name: 'Nova Conta',
        type: 'Corrente',
        balance: 1000,
        icon: 'icon.png',
        userId: 1,
        paymentMethodIds: [1, 2]
      };
      const validAccountData = {
        name: 'Nova Conta',
        type: 'Corrente',
        balance: 1000,
        icon: 'icon.png',
        userId: 1,
        paymentMethodIds: [1, 2]
      };
      const createdAccount = {
        id: 1,
        name: 'Nova Conta',
        type: 'Corrente',
        balance: 1000,
        icon: 'icon.png',
        userId: 1
      };

      mockAccountSchemas.createAccount.parse.mockReturnValue(validAccountData);
      mockAccountRepository.createAccount.mockResolvedValue(createdAccount);

      const result = await AccountService.createAccount(accountData);

      expect(mockAccountSchemas.createAccount.parse).toHaveBeenCalledWith(accountData);
      expect(mockAccountRepository.createAccount).toHaveBeenCalledWith(validAccountData);
      expect(result).toEqual(createdAccount);
    });

    it('should throw error if account creation fails', async () => {
      const accountData = {
        name: 'Nova Conta',
        type: 'Corrente',
        balance: 1000,
        userId: 1
      };
      const validAccountData = {
        name: 'Nova Conta',
        type: 'Corrente',
        balance: 1000,
        userId: 1
      };

      mockAccountSchemas.createAccount.parse.mockReturnValue(validAccountData);
      mockAccountRepository.createAccount.mockResolvedValue(null);

      await expect(AccountService.createAccount(accountData)).rejects.toEqual({ code: 404 });
    });

    it('should handle repository errors during creation', async () => {
      const accountData = { name: 'Conta', type: 'Corrente', balance: 1000, userId: 1 };
      const validAccountData = { name: 'Conta', type: 'Corrente', balance: 1000, userId: 1 };
      const repositoryError = { code: 409, message: 'Account already exists' };

      mockAccountSchemas.createAccount.parse.mockReturnValue(validAccountData);
      mockAccountRepository.createAccount.mockRejectedValue(repositoryError);

      await expect(AccountService.createAccount(accountData)).rejects.toEqual(repositoryError);
    });
  });

  describe('updateAccount', () => {
    it('should update account with filtered data', async () => {
      const id = 1;
      const userId = 1;
      const accountData = {
        name: 'Conta Atualizada',
        type: 'Poupança',
        balance: 2000,
        icon: 'new-icon.png',
        emptyField: ''
      };
      const validId = { id: 1 };
      const validUserId = { userId: 1 };
      const validAccountData = {
        name: 'Conta Atualizada',
        type: 'Poupança',
        balance: 2000,
        icon: 'new-icon.png',
        emptyField: ''
      };
      const filteredData = {
        name: 'Conta Atualizada',
        type: 'Poupança',
        balance: 2000,
        icon: 'new-icon.png'
      };
      const updatedAccount = {
        id: 1,
        name: 'Conta Atualizada',
        type: 'Poupança',
        balance: 2000,
        icon: 'new-icon.png'
      };

      mockAccountSchemas.accountIdParam.parse.mockReturnValue(validId);
      mockAccountSchemas.userIdParam.parse.mockReturnValue(validUserId);
      mockAccountSchemas.updateAccount.parse.mockReturnValue(validAccountData);
      mockAccountRepository.updateAccount.mockResolvedValue(updatedAccount);

      const result = await AccountService.updateAccount(id, userId, accountData);

      expect(mockAccountSchemas.accountIdParam.parse).toHaveBeenCalledWith({ id });
      expect(mockAccountSchemas.userIdParam.parse).toHaveBeenCalledWith({ userId });
      expect(mockAccountSchemas.updateAccount.parse).toHaveBeenCalledWith(accountData);
      expect(mockAccountRepository.updateAccount).toHaveBeenCalledWith(
        validId.id,
        validUserId.userId,
        filteredData
      );
      expect(result).toEqual(updatedAccount);
    });

    it('should throw error if account update fails', async () => {
      const id = 1;
      const userId = 1;
      const accountData = { name: 'Conta Atualizada' };
      const validId = { id: 1 };
      const validUserId = { userId: 1 };
      const validAccountData = { name: 'Conta Atualizada' };

      mockAccountSchemas.accountIdParam.parse.mockReturnValue(validId);
      mockAccountSchemas.userIdParam.parse.mockReturnValue(validUserId);
      mockAccountSchemas.updateAccount.parse.mockReturnValue(validAccountData);
      mockAccountRepository.updateAccount.mockResolvedValue(null);

      await expect(AccountService.updateAccount(id, userId, accountData)).rejects.toEqual({ code: 404 });
    });

    it('should filter out null, undefined and empty string values', async () => {
      const id = 1;
      const userId = 1;
      const accountData = {
        name: 'Conta Válida',
        type: null,
        balance: undefined,
        icon: '',
        validField: 'valor válido'
      };
      const validId = { id: 1 };
      const validUserId = { userId: 1 };
      const validAccountData = {
        name: 'Conta Válida',
        type: null,
        balance: undefined,
        icon: '',
        validField: 'valor válido'
      };
      const filteredData = {
        name: 'Conta Válida',
        validField: 'valor válido'
      };
      const updatedAccount = { id: 1, name: 'Conta Válida' };

      mockAccountSchemas.accountIdParam.parse.mockReturnValue(validId);
      mockAccountSchemas.userIdParam.parse.mockReturnValue(validUserId);
      mockAccountSchemas.updateAccount.parse.mockReturnValue(validAccountData);
      mockAccountRepository.updateAccount.mockResolvedValue(updatedAccount);

      await AccountService.updateAccount(id, userId, accountData);

      expect(mockAccountRepository.updateAccount).toHaveBeenCalledWith(
        validId.id,
        validUserId.userId,
        filteredData
      );
    });

    it('should handle repository errors during update', async () => {
      const id = 1;
      const userId = 1;
      const accountData = { name: 'Conta' };
      const validId = { id: 1 };
      const validUserId = { userId: 1 };
      const validAccountData = { name: 'Conta' };
      const repositoryError = { code: 404, message: 'Account not found' };

      mockAccountSchemas.accountIdParam.parse.mockReturnValue(validId);
      mockAccountSchemas.userIdParam.parse.mockReturnValue(validUserId);
      mockAccountSchemas.updateAccount.parse.mockReturnValue(validAccountData);
      mockAccountRepository.updateAccount.mockRejectedValue(repositoryError);

      await expect(AccountService.updateAccount(id, userId, accountData)).rejects.toEqual(repositoryError);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const id = 1;
      const userId = 1;
      const validId = { id: 1 };
      const validUserId = { userId: 1 };
      const deleteResult = { message: 'Conta deletada com sucesso' };

      mockAccountSchemas.accountIdParam.parse.mockReturnValue(validId);
      mockAccountSchemas.userIdParam.parse.mockReturnValue(validUserId);
      mockAccountRepository.deleteAccount.mockResolvedValue(deleteResult);

      const result = await AccountService.deleteAccount(id, userId);

      expect(mockAccountSchemas.accountIdParam.parse).toHaveBeenCalledWith({ id });
      expect(mockAccountSchemas.userIdParam.parse).toHaveBeenCalledWith({ userId });
      expect(mockAccountRepository.deleteAccount).toHaveBeenCalledWith(validId.id, validUserId.userId);
      expect(result).toEqual(deleteResult);
    });

    it('should handle delete errors', async () => {
      const id = 999;
      const userId = 1;
      const validId = { id: 999 };
      const validUserId = { userId: 1 };
      const deleteError = { code: 404, message: 'Account not found' };

      mockAccountSchemas.accountIdParam.parse.mockReturnValue(validId);
      mockAccountSchemas.userIdParam.parse.mockReturnValue(validUserId);
      mockAccountRepository.deleteAccount.mockRejectedValue(deleteError);

      await expect(AccountService.deleteAccount(id, userId)).rejects.toEqual(deleteError);
    });

    it('should handle database connection errors', async () => {
      const id = 1;
      const userId = 1;
      const validId = { id: 1 };
      const validUserId = { userId: 1 };
      const databaseError = new Error('Database connection failed');

      mockAccountSchemas.accountIdParam.parse.mockReturnValue(validId);
      mockAccountSchemas.userIdParam.parse.mockReturnValue(validUserId);
      mockAccountRepository.deleteAccount.mockRejectedValue(databaseError);

      await expect(AccountService.deleteAccount(id, userId)).rejects.toEqual(databaseError);
    });
  });

});
