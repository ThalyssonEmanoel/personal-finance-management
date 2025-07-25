import TransactionRepository from '../repositories/TransactionRepository.js';
import TransactionSchemas from '../schemas/TransactionSchemas.js';

class TransactionService {
  static async listTransactions(filtros, order = 'asc') {
    const validFiltros = TransactionSchemas.listTransaction.parse(filtros);
    const page = validFiltros.page ?? 1;
    const limit = validFiltros.limit ?? 10;
    const { page: _p, limit: _l, ...dbFilters } = validFiltros;

    if (dbFilters.id) {
      dbFilters.id = parseInt(dbFilters.id);
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);
    const [transactions, total] = await Promise.all([
      TransactionRepository.listTransactions(dbFilters, skip, take, order),
      TransactionRepository.countTransactions(dbFilters)
    ]);
    return { transactions, total, take };
  }

  static async createTransaction(transaction) {
    const validTransaction = TransactionSchemas.createTransaction.parse(transaction);
    
    const newTransaction = await TransactionRepository.createTransaction(validTransaction);
    if (!newTransaction) {
      throw { code: 404 };
    }
    return newTransaction;
  }

  static async updateTransaction(id, transactionData) {
    const validId = TransactionSchemas.transactionIdParam.parse({ id });
    const validTransactionData = TransactionSchemas.updateTransaction.parse(transactionData);
    
    const updatedTransaction = await TransactionRepository.updateTransaction(validId.id, validTransactionData);
    if (!updatedTransaction) {
      throw { code: 404 };
    }
    return updatedTransaction;
  }

  static async deleteTransaction(id) {
    const validId = TransactionSchemas.transactionIdParam.parse({ id });
    const result = await TransactionRepository.deleteTransaction(validId.id);
    return result;
  }

  static async getCompatiblePaymentMethods(accountId) {
    const validAccountId = TransactionSchemas.accountIdParam.parse({ accountId });
    const compatibleMethods = await TransactionRepository.getCompatiblePaymentMethods(validAccountId.accountId);
    
    return compatibleMethods.map(apm => ({
      id: apm.paymentMethod.id,
      name: apm.paymentMethod.name
    }));
  }
}

export default TransactionService;