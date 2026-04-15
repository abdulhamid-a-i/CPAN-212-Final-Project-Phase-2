import mongoose from "mongoose";
import { cartRepository } from '../repositories/cartRepository.js'
import { AppError } from "../utils/appError.js";
import { Book } from "../models/Book.js";

export const cartService = {
  async getOrCreateCart(userId) {
    let cart = await cartRepository.findByUser(userId);

    if (!cart) {
      cart = await cartRepository.create({ user: userId });
    }

    return cart;
  },

  async getCart(userId) {
    let cart = await this.getOrCreateCart(userId);

    return cart;
  },

  async addToCart(userId, bookId, quantity = 1) {
    if (quantity < 1) throw new AppError("Quantity must be at least 1", 400);

    const cart = await this.getOrCreateCart(userId);

    const book = await Book.findById(bookId);
    if (!book) throw new AppError("Book not found", 404);

    const existingItem = cart.contents.find(
      item => item.book._id.toString() === bookId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.contents.push({
        book: book,
        quantity,
        price: book.price 
      });
    }

    return cartRepository.save(cart);
  },

  async removeFromCart(userId, bookId) {
    const cart = await cartRepository.findByUser(userId);
    if (!cart) return null;

    cart.contents = cart.contents.filter(
      item => item.book._id.toString() !== bookId
    );

    return cartRepository.save(cart);
  },

  async updateQuantity(userId, bookId, quantity) {
    if (quantity < 1) throw new AppError("Invalid quantity", 400);

    const cart = await cartRepository.findByUser(userId);
    if (!cart) return null;

    const item = cart.contents.find(
      item => item.book._id.toString() === bookId
    );

    if (!item) throw new AppError("Item not in cart", 404);

    item.quantity = quantity;

    return cartRepository.save(cart);
  },

  async clearCart(userId) {
    const cart = await cartRepository.findByUser(userId);
    if (!cart) return null;

    cart.contents = [];
    return cartRepository.save(cart);
  }
};