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
  static listAllAccountPaymentMethods = async (req, res, next) => {
    try {
      const query = req.query;
      // Garante que page será passado corretamente para o response
      const page = query.page ? Number(query.page) : 1;
      const { accountPaymentMethods, total, take } = await PaymentMethodsService.listAccountPaymentMethods(query, 'desc');
      res.status(200).json(CommonResponse.success(accountPaymentMethods, total, page, take));
    } catch (err) {
      next(err)
    }
  };

  static getPaymentMethodById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const paymentMethod = await PaymentMethodsService.getPaymentMethodById(id);
      res.status(200).json(CommonResponse.success(paymentMethod));
    } catch (err) {
      next(err)
    }
  };

  static createPaymentMethod = async (req, res, next) => {
    try {
      const paymentMethod = await PaymentMethodsService.createPaymentMethod(req.body);
      res.status(201).json(CommonResponse.success(paymentMethod));
    } catch (err) {
      next(err)
    }
  };

  static updatePaymentMethod = async (req, res, next) => {
    try {
      const { id } = req.params;
      const paymentMethod = await PaymentMethodsService.updatePaymentMethod(id, req.body);
      res.status(200).json(CommonResponse.success(paymentMethod));
    } catch (err) {
      next(err)
    }
  };

  static deletePaymentMethod = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await PaymentMethodsService.deletePaymentMethod(id);
      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err)
    }
  };
}

export default PaymentMethodsController;
