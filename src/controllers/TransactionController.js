import TransactionService from '../services/TransactionService.js';
import CommonResponse from "../utils/commonResponse.js";

class TransactionController {

  static listAllTransactions = async (req, res, next) => {
    try {
      const query = req.query;
      const page = query.page ? Number(query.page) : 1;
      const { transactions, total, take } = await TransactionService.listTransactions(query, 'desc');
      res.status(200).json(CommonResponse.success(transactions, total, page, take));
    } catch (err) {
      next(err)
    }
  };

  static createTransaction = async (req, res, next) => {
    try {
      const transactionData = req.body;
      const transaction = await TransactionService.createTransaction(transactionData);
      res.status(201).json(CommonResponse.success(transaction));
    } catch (err) {
      next(err);
    }
  };

  static updateTransaction = async (req, res, next) => {
    try {
      const { id } = req.params;
      const transactionData = req.body;
      const updatedTransaction = await TransactionService.updateTransaction(id, transactionData);
      res.status(200).json(CommonResponse.success(updatedTransaction));
    } catch (err) {
      next(err);
    }
  };

  static deleteTransaction = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await TransactionService.deleteTransaction(id);
      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };

  static getCompatiblePaymentMethods = async (req, res, next) => {
    try {
      const { accountId } = req.params;
      const paymentMethods = await TransactionService.getCompatiblePaymentMethods(accountId);
      res.status(200).json(CommonResponse.success(paymentMethods));
    } catch (err) {
      next(err);
    }
  };
}

export default TransactionController;