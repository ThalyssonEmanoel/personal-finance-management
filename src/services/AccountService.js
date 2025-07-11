import AccountRepository from '../repositories/AccountRepository.js';
import AccountSchemas from '../schemas/AccountsSchemas.js';
//TypeScript: Restart TS server

class AccountService {
  static async listAccounts(filtros, page, limit, order = 'asc') {
    const validFiltros = AccountSchemas.listAccount.parse(filtros);
    const { page: validPage, limit: validLimit, ...dbFilters } = validFiltros;

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

  static async createAccount(account) {
    const validAccount = AccountSchemas.createAccount.parse(account);
    
    const newAccount = await AccountRepository.createAccount(validAccount);
    if (!newAccount) {
      throw { code: 404 };
    }
    return newAccount;
  }

  static async updateAccount(id, accountData) {
    const validId = AccountSchemas.accountIdParam.parse({ id });
    const validAccountData = AccountSchemas.updateAccount.parse(accountData);
    const updatedAccount = await AccountRepository.updateAccount(validId.id, validAccountData);
    if (!updatedAccount) {
      throw { code: 404 };
    }
    return updatedAccount;
  }

  static async deleteAccount(id) {
    const validId = AccountSchemas.accountIdParam.parse({ id });
    const result = await AccountRepository.deleteAccount(validId.id);
    return result;
  }
}

export default AccountService;