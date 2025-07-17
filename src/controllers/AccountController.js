import AccountService from '../services/AccountService.js';
import CommonResponse from "../utils/commonResponse.js";

class AccountController {

  static listAllAccounts = async (req, res, next) => {
    try {
      const query = req.query;
      // Garante que page será passado corretamente para o response
      const page = query.page ? Number(query.page) : 1;
      const { contas, total, take } = await AccountService.listAccounts(query, 'desc');
      res.status(200).json(CommonResponse.success(contas, total, page, take));
    } catch (err) {
      next(err)
    }
  };

  static registerAccount = async (req, res, next) => {
    try {

      const { name, type, balance, userId } = req.body;
      let icon = "";
      if (req.file) {
        icon = `uploads/${req.file.filename}`;
      }

      const account = await AccountService.createAccount({ name, type, balance, icon, userId });
      res.status(201).json(CommonResponse.success(account));
    } catch (err) {
      next(err);
    }
  };

  static updateAccount = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, type, balance, userId } = req.body;
      let icon = req.body.icon;
      if (req.file) {
        icon = `uploads/avatares/${req.file.filename}`;
      }
      const accountData = { name, type, balance, icon, userId };
      const updatedAccount = await AccountService.updateAccount(id, accountData);
      res.status(200).json(CommonResponse.success(updatedAccount));
    } catch (err) {
      next(err);
    }
  };

  static deleteAccount = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await AccountService.deleteAccount(id);
      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };
}

export default AccountController;