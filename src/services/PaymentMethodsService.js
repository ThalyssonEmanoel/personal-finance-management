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

  static async getPaymentMethodById(id) {
    const validId = PaymentMethodsSchemas.getPaymentMethodById.parse({ id });
    return await PaymentMethodsRepository.getPaymentMethodById(validId.id);
  }

  static async createPaymentMethod(data) {
    const validData = PaymentMethodsSchemas.createPaymentMethod.parse(data);
    return await PaymentMethodsRepository.createPaymentMethod(validData);
  }

  static async updatePaymentMethod(id, data) {
    const validId = PaymentMethodsSchemas.getPaymentMethodById.parse({ id });
    const validData = PaymentMethodsSchemas.updatePaymentMethod.parse(data);
    
    // Só atualizar se houver dados válidos
    if (Object.keys(validData).length === 0) {
      throw { code: 400, message: "Nenhum dado válido fornecido para atualização" };
    }
    
    return await PaymentMethodsRepository.updatePaymentMethod(validId.id, validData);
  }

  static async deletePaymentMethod(id) {
    const validId = PaymentMethodsSchemas.getPaymentMethodById.parse({ id });
    return await PaymentMethodsRepository.deletePaymentMethod(validId.id);
  }
}

export default PaymentMethodsService;
