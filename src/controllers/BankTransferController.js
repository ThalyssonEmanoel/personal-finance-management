import BankTransferService from '../services/BankTransferService.js';
import CommonResponse from "../utils/commonResponse.js";
import BankTransferSchemas from '../schemas/BankTransferSchemas.js';

class BankTransferController {

  static listAllBankTransferAdmin = async (req, res, next) => {
    try {
      const query = req.query;
      const page = query.page ? Number(query.page) : 1;
      const { bankTransfers, total, take } = await BankTransferService.listBankTransfers(query, 'desc');
      res.status(200).json(CommonResponse.success(bankTransfers, total, page, take));
    } catch (err) {
      next(err)
    }
  };

  static listAllBankTransferUsers = async (req, res, next) => {
    try {
      const query = req.query;
      const validQuery = BankTransferSchemas.listBankTransferUser.parse(query);
      const page = validQuery.page ? Number(validQuery.page) : 1;
      const { bankTransfers, total, take } = await BankTransferService.listBankTransfers(validQuery, 'desc');
      res.status(200).json(CommonResponse.success(bankTransfers, total, page, take));
    } catch (err) {
      next(err)
    }
  };

  static createTransfer = async (req, res, next) => {
    try {
      const bodyData = BankTransferSchemas.createBankTransferRequest.parse(req.body);
      const queryData = BankTransferSchemas.createBankTransferQuery.parse(req.query);

      const { amount, transfer_date, description, sourceAccountId, destinationAccountId, paymentMethodId } = bodyData;
      const { userId } = queryData;
      const bankTransfer = await BankTransferService.createTransfer({ 
        amount, 
        transfer_date, 
        description, 
        sourceAccountId, 
        destinationAccountId, 
        paymentMethodId, 
        userId 
      });
      res.status(201).json(CommonResponse.success(bankTransfer));
    } catch (err) {
      next(err);
    }
  };

  static updateTransfer = async (req, res, next) => {
    try {
      const { id, userId } = req.query;
      const bankTransferData = req.body;
      const updatedBankTransfer = await BankTransferService.updateTransfer(parseInt(id), parseInt(userId), bankTransferData);
      res.status(200).json(CommonResponse.success(updatedBankTransfer));
    } catch (err) {
      next(err);
    }
  };

  static deleteTransfer = async (req, res, next) => {
    try {
      const { id } = req.query;
      const { userId } = req.query;
      const result = await BankTransferService.deleteTransfer(parseInt(id), parseInt(userId));
      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };
}

export default BankTransferController;