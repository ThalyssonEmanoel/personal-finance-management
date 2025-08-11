import AccountService from '../services/AccountService.js';
import AccountSchemas from '../schemas/AccountsSchemas.js';
import CommonResponse from "../utils/commonResponse.js";

class AccountController {

  static listAllAccountsAdmin = async (req, res, next) => {
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

  static listAllAccountsUser = async (req, res, next) => {
    try {
      const query = req.query;
      const queryFiltrada = AccountSchemas.listAccountUser.parse(query);
      // Garante que page será passado corretamente para o response
      const page = queryFiltrada.page ? Number(queryFiltrada.page) : 1;
      const { contas, total, take } = await AccountService.listAccounts(queryFiltrada, 'desc');
      res.status(200).json(CommonResponse.success(contas, total, page, take));
    } catch (err) {
      next(err)
    }
  };

  static registerAccount = async (req, res, next) => {
    try {
      // Validar body e query separadamente
      const bodyData = AccountSchemas.createAccountBody.parse(req.body);
      const queryData = AccountSchemas.createAccountQuery.parse(req.query);

      const { name, type, balance, paymentMethodIds } = bodyData;
      const { userId } = queryData;

      let icon = "";
      if (req.file) {
        icon = `uploads/${req.file.filename}`;
      }

      const account = await AccountService.createAccount({ name, type, balance, icon, paymentMethodIds, userId });
      res.status(201).json(CommonResponse.success(account));
    } catch (err) {
      next(err);
    }
  };

  static updateAccount = async (req, res, next) => {
    try {
      const { id, userId } = req.query;

      const accountData = {};
      

      if (req.body.name !== undefined && req.body.name !== null && req.body.name.trim() !== '') {
        accountData.name = req.body.name;
      }
      if (req.body.type !== undefined && req.body.type !== null && req.body.type.trim() !== '') {
        accountData.type = req.body.type;
      }
      if (req.body.balance !== undefined && req.body.balance !== null && req.body.balance !== '') {
        accountData.balance = req.body.balance;
      }
      if (req.body.paymentMethodIds !== undefined && req.body.paymentMethodIds !== null && req.body.paymentMethodIds.trim() !== '') {
        accountData.paymentMethodIds = req.body.paymentMethodIds;
      }
      
      if (req.file) {
        accountData.icon = `uploads/${req.file.filename}`;
      } else if (req.body.icon !== undefined) {
        accountData.icon = req.body.icon;
      }

      const updatedAccount = await AccountService.updateAccount(parseInt(id), parseInt(userId), accountData);
      res.status(200).json(CommonResponse.success(updatedAccount));
    } catch (err) {
      next(err);
    }
  };

  static deleteAccount = async (req, res, next) => {
    try {
      const { id } = req.query;
      const { userId } = req.query;
      const result = await AccountService.deleteAccount(id, userId);
      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };
}

export default AccountController;