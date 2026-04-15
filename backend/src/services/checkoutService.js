import mongoose from "mongoose";
import { checkoutRepository } from '../repositories/checkoutRepository.js'
import { AppError } from "../utils/appError.js";
import { Cart } from "../models/Cart.js";
import { Book } from "../models/Book.js";
import { cartRepository } from "../repositories/cartRepository.js";

export const checkoutService = {
  async getOrCreateCheckout(userId) {
    let checkout = await checkoutRepository.findByUser(userId);

    if (!checkout) {
        let cart = await Cart.findOne({user: userId});
    if (!cart || !Array.isArray(cart.contents) || cart.contents.length === 0) {
      throw new AppError(
        "Cart is empty. Please add items before proceeding to checkout",
        400
      );
    }
      checkout = await checkoutRepository.create({ user: userId,
        contents: cart.contents,
       });

       return checkoutRepository.findByUser(userId);
    }

    return checkout;
  },

  async getCheckout(userId) {
    let checkout = await this.getOrCreateCheckout(userId);

    return checkout;
  },

  async purchase(userId, payload){
    const {address, paymentMethod} = payload;

    let checkout = await this.getOrCreateCheckout(userId);

    if (!checkout || checkout.contents.length === 0 || checkout.contents === null) {
    throw new AppError("Checkout is empty", 400);
  }

    checkout.address = address;
    checkout.paymentMethod = paymentMethod;


  for (const item of checkout.contents) {
    const updated = await Book.findOneAndUpdate(
      {
        _id: item.book,
        quantity: { $gte: item.quantity }
      },
      {
        $inc: { quantity: -item.quantity }
      },
      { new: true }
    );

    if (!updated) {
      throw new AppError("Stock issue: item unavailable",400);
    }
  }

  const updatedCheckout = await checkout.save();


    // Clears old checkout
    checkoutRepository.delete(checkout._id);
    // clears shopping cart
    let cart = await cartRepository.findByUser(userId);

    await cartRepository.delete(cart._id);
    

    return updatedCheckout;



  },

  async clearCheckout(userId) {
    const checkout = await checkoutRepository.findByUser(userId);
    if (!checkout) return null;

    return checkoutRepository.delete(checkout);
  }
};