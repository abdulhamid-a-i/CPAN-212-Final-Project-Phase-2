import mongoose from "mongoose";
import { bookRepository } from "../repositories/bookRepository.js";
import { AppError } from "../utils/appError.js";

const ALLOWED_GENRE_TYPES = ["fiction", "non_fiction"]

function normalizeCreateOrUpdatePayload(payload) {
    const {
        isbn,
        title,
        author,
        description,
        genre,
        publishedDate,
        quantity,
        price,
        coverImg
    } = payload;

    const normalizedDescription = description?.trim() || undefined;

    if (description && description.trim().length < 10){
        throw new AppError("Description must be at least 10 characters", 422)
    }

    const normalizedCoverImg = coverImg?.trim() || undefined ;

    if(!isbn) {
        throw new AppError("ISBN is required", 422);
    }

    if(!author){
        throw new AppError("Author is required", 422);
    }

    if(!title) {
        throw new AppError("Title is required", 422);
    }

    if(!genre){
        throw new AppError("Genre is required", 422);
    }

    if(!ALLOWED_GENRE_TYPES.includes(genre)) {
        throw new AppError("Genre must be fiction or non_fiction", 422);
    }

    if(!publishedDate) {
        throw new AppError("Published date is required", 422);
    }

    const normalizedQuantity = Number(quantity);
    const normalizedPrice = Number(price);

    if(Number.isNaN(normalizedQuantity) || normalizedQuantity < 0){
        throw new AppError("Quantity must be a valid non-negative number", 422);
    }

        if(Number.isNaN(normalizedPrice) || normalizedPrice < 0){
        throw new AppError("Price must be a valid non-negative number", 422);
    }

    return {
        isbn, 
        title,
        author, 
        description: normalizedDescription, 
        genre, 
        publishedDate,
        quantity: normalizedQuantity,
        price: normalizedPrice,
        coverImg: normalizedCoverImg
    }

}



export const bookService = {
    listAll(req) {
        return bookRepository.findAll(req);
    },
    async getById(bookId){
        if (!mongoose.Types.ObjectId.isValid(bookId)){
            throw new AppError("Invalid book id", 400);
        }

        const book = await bookRepository.findById(bookId)

        if (!book){
            throw new AppError("Book not found", 404);
        }

        return book;
    },

    async create(payload) {
        const normalizedPayload = normalizeCreateOrUpdatePayload(payload);
        return bookRepository.create({
            ...normalizedPayload
        });
    },

    async update(bookId, payload) {
        const existingBook = await this.getById(bookId);

        if (!existingBook){
            throw new AppError("Book not found", 404);
        }

        const baseObject =
        typeof existingBook.toObject === "function"
            ? existingBook.toObject()
            : existingBook;
        
        const normalizedPayload = normalizeCreateOrUpdatePayload({
            ...baseObject,
            ...payload
        });

        const updatedBook = await bookRepository.updateById(bookId, normalizedPayload);

        if (!updatedBook){
            throw new AppError("Book not found", 404);
        }

        return updatedBook;
    },

    async updateQuantity(bookId, payload){
        const existingBook = await this.getById(bookId);

        if (!existingBook){
            throw new AppError("Book not found", 404);
        }
        const { quantity } = payload;

        const updatedBook = await bookRepository.updateQuantityById(bookId, quantity);

        return updatedBook;


    },

    async delete(bookId){
        const book = await this.getById(bookId);

        if(!book) {
            throw new AppError("Book not found", 404);
        }

        return bookRepository.delete(bookId);
    }
}