import { checkoutService } from "../services/checkoutService.js";
import { successResponse } from "../utils/apiResponse.js";

export const checkoutController = {
  async getOwnCheckout(req, res, next) {
    try {
      const data = await checkoutService.getCheckout(req.user._id);

      return successResponse(res, data, "Checkout loaded");
    } catch (error) {
      next(error);
    }
  },

   async clearCheckout(req, res, next) {
    try {
      const data = await checkoutService.clearCheckout(req.user._id);

      return successResponse(res, data, "Cancellation Successful");
    } catch (error) {
      next(error);
    }
  },

  async purchase(req, res, next){
        try {
      const data = await checkoutService.purchase(req.user._id, req.body);

      return successResponse(res, data, "Purchase Successful");
    } catch (error) {
      next(error);
    }
  }

  
};