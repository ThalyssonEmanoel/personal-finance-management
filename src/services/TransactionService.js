import TransactionRepository from '../repositories/TransactionRepository.js';
import TransactionSchemas from '../schemas/TransactionSchemas.js';

class TransactionService {
  static async listTransactions(filtros, order = 'asc') {
    const validFiltros = TransactionSchemas.listTransaction.parse(filtros);
    
    // Garante valores padrão caso não venham na query
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
      TransactionRepository.countTransactions()
    ]);
    return { transactions, total, take };
  }
}

export default TransactionService;