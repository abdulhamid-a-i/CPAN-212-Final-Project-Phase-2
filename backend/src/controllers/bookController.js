import { bookService } from "../services/bookService.js";
import { successResponse } from "../utils/apiResponse.js";

export const bookController = {
    async listBooks(req, res, next) {
        try {

            const data = await bookService.listAll(req);
            
            return successResponse(res, data, "Books loaded");
        } catch (error){
            next(error);
        }
    },

    async getBookById(req, res, next){
        try {
            const data = await bookService.getById(req.params.bookId);
            return successResponse(res, data, "Book loaded");
        } catch (error) {
            next(error);
        }
    },

    async updateBookById(req, res, next){
        try {
            const data = await bookService.update(req.params.bookId, req.body);

            return successResponse(res, data, "Book updated")
        } catch (error) {
            next(error);
        }
    },

    async updateBookQuantity(req, res, next){
        try {
            const data = await bookService.updateQuantity(req.params.bookId, req.body);

            return successResponse(res, data, "Book Quantity updated");
        } catch (error) {
            next(error);
        }
    },

    async createBook(req, res, next){
        try {
            const data = await bookService.create(req.body);

            return successResponse(res, data, "Book created", 201);
        } catch (error){
            next(error);
        }
    },

    async deleteBook(req, res, next){
        try{
            await bookService.delete(req.params.bookId); 
            return successResponse(res, null, "Book deleted");
        } catch (error){
            next(error);
        }
    }
};