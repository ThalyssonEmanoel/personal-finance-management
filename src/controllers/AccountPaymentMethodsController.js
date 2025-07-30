import AccountPaymentMethodsService from '../services/AccountPaymentMethodsService.js';
import CommonResponse from "../utils/commonResponse.js";

class AccountPaymentMethodsController {

  static listAllAccountPaymentMethods = async (req, res, next) => {
    try {
      const query = req.query;
      // Garante que page será passado corretamente para o response
      const page = query.page ? Number(query.page) : 1;
      const { accountPaymentMethods, total, take } = await AccountPaymentMethodsService.listAccountPaymentMethods(query, 'desc');
      res.status(200).json(CommonResponse.success(accountPaymentMethods, total, page, take));
    } catch (err) {
      next(err)
    }
  };
}

export default AccountPaymentMethodsController;
