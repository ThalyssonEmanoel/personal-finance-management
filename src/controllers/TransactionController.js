import TransactionService from '../services/TransactionService.js';
import CommonResponse from "../utils/commonResponse.js";

class TransactionController {

  static listAllTransactions = async (req, res, next) => {
    try {
      const query = req.query;
      // Garante que page será passado corretamente para o response
      const page = query.page ? Number(query.page) : 1;
      const { transactions, total, take } = await TransactionService.listTransactions(query, 'desc');
      res.status(200).json(CommonResponse.success(transactions, total, page, take));
    } catch (err) {
      next(err)
    }
  };
}

export default TransactionController;