import { Checkout } from "../models/Checkout.js";

export const checkoutRepository = {
  async findByUser(userId) {
    return Checkout.findOne({ user: userId }).populate("contents.book");
  },

  async create(checkoutData) {
    return Checkout.create(checkoutData);
  },

  async save(checkout) {
    return checkout.save();
  },

  async delete(checkoutId) {
    return Checkout.findByIdAndDelete(checkoutId);
  }
};