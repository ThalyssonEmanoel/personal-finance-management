import AccountRepository from '../repositories/AccountRepository.js';
import AccountSchemas from '../schemas/AccountsSchemas.js';
//TypeScript: Restart TS server

class AccountService {
  static async listAccounts(filtros, order = 'asc') {
    const validFiltros = AccountSchemas.listAccount.parse(filtros);
    
    // Garante valores padrão caso não venham na query
    const page = validFiltros.page ?? 1;
    const limit = validFiltros.limit ?? 10;
    const { page: _p, limit: _l, ...dbFilters } = validFiltros;

    if (dbFilters.id) {
      dbFilters.id = parseInt(dbFilters.id);
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);
    const [contas, total] = await Promise.all([
      AccountRepository.listAccounts(dbFilters, skip, take, order),
      AccountRepository.contAccounts()
    ]);
    return { contas, total, take };
  }

  static async getAccountById(id) {
    const validId = AccountSchemas.accountIdParam.parse({ id });
    const account = await AccountRepository.getAccountById(validId.id);
    
    if (!account) {
      throw { code: 404, message: "Conta não encontrada" };
    }

    return account;
  }

  static async createAccount(account) {
    const validAccount = AccountSchemas.createAccount.parse(account);
    const newAccount = await AccountRepository.createAccount(validAccount);
    if (!newAccount) {
      throw { code: 404 };
    }
    return newAccount;
  }

  static async updateAccount(id, userId, accountData) {

    const validId = AccountSchemas.accountIdParam.parse({ id });
    const validUserId = AccountSchemas.userIdParam.parse({ userId });
    const validAccountData = AccountSchemas.updateAccount.parse(accountData);
    
    // Filtrar campos vazios/nulos para não serem processados
    const filteredData = {};
    Object.keys(validAccountData).forEach(key => {
      const value = validAccountData[key];
      if (value !== undefined && value !== null && value !== "") {
        filteredData[key] = value;
      }
    });

    const updatedAccount = await AccountRepository.updateAccount(validId.id, validUserId.userId, filteredData);
    if (!updatedAccount) {
      throw { code: 404 };
    }
    return updatedAccount;
  }

  static async deleteAccount(id, userId) {
    const validId = AccountSchemas.accountIdParam.parse({ id });
    const validUserId = AccountSchemas.userIdParam.parse({ userId });
    const result = await AccountRepository.deleteAccount(validId.id, validUserId.userId);
    return result;
  }
}

export default AccountService;