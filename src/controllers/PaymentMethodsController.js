import PaymentMethodsService from '../services/PaymentMethodsService.js';
import CommonResponse from "../utils/commonResponse.js";

class PaymentMethodsController {

  static listAllPaymentMethods = async (req, res, next) => {
    try {
      const query = req.query;
      // Garante que page será passado corretamente para o response
      const page = query.page ? Number(query.page) : 1;
      const { paymentMethods, total, take } = await PaymentMethodsService.listPaymentMethods(query, 'desc');
      res.status(200).json(CommonResponse.success(paymentMethods, total, page, take));
    } catch (err) {
      next(err)
    }
  };
}

export default PaymentMethodsController;
