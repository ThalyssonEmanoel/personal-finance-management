import PaymentMethodsRepository from '../repositories/PaymentMethodsRepository.js';
import PaymentMethodsSchemas from '../schemas/PaymentMethodsSchemas.js';

class PaymentMethodsService {
  static async listPaymentMethods(filtros, order = 'asc') {
    const validFiltros = PaymentMethodsSchemas.listPaymentMethods.parse(filtros);

    // Garante valores padrão caso não venham na query
    const page = validFiltros.page ?? 1;
    const limit = validFiltros.limit ?? 10;
    const { page: _p, limit: _l, ...dbFilters } = validFiltros;

    if (dbFilters.id) {
      dbFilters.id = parseInt(dbFilters.id);
    }
  
    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);
    const [paymentMethods, total] = await Promise.all([
      PaymentMethodsRepository.listPaymentMethods(dbFilters, skip, take, order),
      PaymentMethodsRepository.countPaymentMethods(dbFilters)
    ]);
    return { paymentMethods, total, take };
  }
  static async listAccountPaymentMethods(filtros, order = 'asc') {
    const validFiltros = PaymentMethodsSchemas.listAccountPaymentMethods.parse(filtros);

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
      PaymentMethodsRepository.listAccountPaymentMethods(dbFilters, skip, take, order),
      PaymentMethodsRepository.countAccountPaymentMethods(dbFilters)
    ]);
    return { accountPaymentMethods, total, take };
  }
}

export default PaymentMethodsService;
