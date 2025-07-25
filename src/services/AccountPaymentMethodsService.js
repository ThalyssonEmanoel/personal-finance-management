import AccountPaymentMethodsRepository from '../repositories/AccountPaymentMethodsRepository.js';
import AccountPaymentMethodsSchemas from '../schemas/AccountPaymentMethodsSchemas.js';

class AccountPaymentMethodsService {
  static async listAccountPaymentMethods(filtros, order = 'asc') {
    const validFiltros = AccountPaymentMethodsSchemas.listAccountPaymentMethods.parse(filtros);
    
    // Garante valores padrão caso não venham na query
    const page = validFiltros.page ?? 1;
    const limit = validFiltros.limit ?? 10;
    const { page: _p, limit: _l, ...dbFilters } = validFiltros;

    if (dbFilters.id) {
      dbFilters.id = parseInt(dbFilters.id);
    }
    if (dbFilters.accountId) {
      dbFilters.accountId = parseInt(dbFilters.accountId);
    }
    if (dbFilters.paymentMethodId) {
      dbFilters.paymentMethodId = parseInt(dbFilters.paymentMethodId);
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);
    const [accountPaymentMethods, total] = await Promise.all([
      AccountPaymentMethodsRepository.listAccountPaymentMethods(dbFilters, skip, take, order),
      AccountPaymentMethodsRepository.countAccountPaymentMethods(dbFilters)
    ]);
    return { accountPaymentMethods, total, take };
  }
}

export default AccountPaymentMethodsService;
