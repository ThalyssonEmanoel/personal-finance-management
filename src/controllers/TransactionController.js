import TransactionService from '../services/TransactionService.js';
import CommonResponse from "../utils/commonResponse.js";
import TransactionSchemas from '../schemas/TransactionSchemas.js';
import { generateTransactionPDF } from '../utils/pdfGenerator.js';

class TransactionController {

  static downloadStatementPDF = async (req, res, next) => {
    try {
      const { userId, startDate, endDate, type, accountId } = req.query;
      if (!userId || !startDate || !endDate || !type) {
        return res.status(400).json({ error: 'Parâmetros obrigatórios: userId, startDate, endDate, type' });
      }
      const transactions = await TransactionService.getTransactionsForPDF({ userId, startDate, endDate, type, accountId });
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ error: 'Nenhuma transação encontrada para o período informado.' });
      }
      const pdfDoc = generateTransactionPDF(transactions, startDate, endDate, type);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="extrato_${userId}_${startDate}_a_${endDate}.pdf"`);
      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (err) {
      next(err);
    }
  };

  static listAllTransactionsAdmin = async (req, res, next) => {
    try {
      const query = req.query;
      const page = query.page ? Number(query.page) : 1;
      const { transactions, total, take } = await TransactionService.listTransactions(query, 'desc');
      res.status(200).json(CommonResponse.success(transactions, total, page, take));
    } catch (err) {
      next(err)
    }
  };

  static listAllTransactionsUsers = async (req, res, next) => {
    try {
      const query = req.query;
      const validQuery = TransactionSchemas.listTransactionUser.parse(query);
      const page = validQuery.page ? Number(validQuery.page) : 1;
      const { transactions, total, take } = await TransactionService.listTransactions(validQuery, 'desc');
      res.status(200).json(CommonResponse.success(transactions, total, page, take));
    } catch (err) {
      next(err)
    }
  };

  static createTransaction = async (req, res, next) => {
    try {
      const bodyData = TransactionSchemas.createTransactionRequest.parse(req.body);
      const queryData = TransactionSchemas.createTransactionQuery.parse(req.query);

      const { name, type, category, value, release_date, number_installments, recurring, description, accountId, paymentMethodId } = bodyData;
      const { userId } = queryData;
      const transaction = await TransactionService.createTransaction({ name, type, category, value, release_date, number_installments, recurring, description, accountId, paymentMethodId, userId });
      res.status(201).json(CommonResponse.success(transaction));
    } catch (err) {
      next(err);
    }
  };

  static updateTransaction = async (req, res, next) => {
    try {
      const { id, userId } = req.query;
      const transactionData = req.body;
      const updatedTransaction = await TransactionService.updateTransaction(id, userId, transactionData);
      res.status(200).json(CommonResponse.success(updatedTransaction));
    } catch (err) {
      next(err);
    }
  };

  static deleteTransaction = async (req, res, next) => {
    try {
      const { id } = req.query;
      const { userId } = req.query;
      const result = await TransactionService.deleteTransaction(id, userId);
      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };
}

export default TransactionController;