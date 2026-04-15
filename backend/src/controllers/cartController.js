import { cartService } from "../services/cartService.js";
import { successResponse } from "../utils/apiResponse.js";

export const cartController = {
  async getOwnCart(req, res, next) {
    try {
      const data = await cartService.getCart(req.user._id);

      return successResponse(res, data, "Cart loaded");
    } catch (error) {
      next(error);
    }
  },

  async addToCart(req, res, next) {
    try {
      const { bookId, quantity } = req.body;

      const data = await cartService.addToCart(
        req.user._id,
        bookId,
        quantity
      );

      return successResponse(res, data, "Item added to cart");
    } catch (error) {
      next(error);
    }
  },

  async updateCartQuantity(req, res, next) {
    try {
      const { bookId, quantity } = req.body;

      const data = await cartService.updateQuantity(
        req.user._id,
        bookId,
        quantity
      );

      return successResponse(res, data, "Cart quantity updated");
    } catch (error) {
      next(error);
    }
  },

  async removeFromCart(req, res, next) {
    try {
      const { bookId } = req.params;

      const data = await cartService.removeFromCart(
        req.user._id,
        bookId
      );

      return successResponse(res, data, "Item removed from cart");
    } catch (error) {
      next(error);
    }
  },
   async clearCart(req, res, next) {
    try {
      const data = await cartService.clearCart(req.user._id);

      return successResponse(res, data, "Cart cleared");
    } catch (error) {
      next(error);
    }
  }

  
};