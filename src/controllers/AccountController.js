import AccountService from '../services/AccountService.js';
import CommonResponse from "../utils/commonResponse.js";

class AccountController {

  static listAllAccounts = async (req, res, next) => {
    try {
      const { page, limit = 10, ...filtros } = req.query;
      const { contas, total, take } = await AccountService.listAccounts(filtros, page || 1, limit, 'desc');
      res.status(200).json(CommonResponse.success(contas, total, page || 1, take));
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