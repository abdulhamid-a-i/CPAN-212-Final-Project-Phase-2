import { Cart } from "../models/Cart.js";

export const cartRepository = {
  async findByUser(userId) {
    return Cart.findOne({ user: userId }).populate("contents.book");
  },

  async create(cartData) {
    return Cart.create(cartData);
  },

  async save(cart) {
    return cart.save();
  },

  async delete(cartId) {
    return Cart.findByIdAndDelete(cartId);
  }
};