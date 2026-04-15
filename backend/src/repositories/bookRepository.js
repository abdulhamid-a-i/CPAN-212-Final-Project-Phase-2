import { Book } from "../models/Book.js";

export const bookRepository = {
   async findAll(req){
        const { genre, q} = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = {};

        if (genre) filter.genre = genre;

        let query;
        if (q) {
            query = await Book.find({
                ...filter,
                $text: { $search: q}
            })
            .skip((page - 1) * limit)
            .limit(limit)
        } else {
            query = await Book.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
        }
        const totalBooks = await Book.countDocuments();
        return ({
            page,
            limit,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            books: query
        });

    },
    findById(id){
        return Book.findById(id);
    },
    updateById(id, payload){
        return Book.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
    },
    async updateQuantityById(id, quantity){
        const existingBook = await Book.findById(id);
        
        existingBook.quantity = quantity;

        await existingBook.save();

        const updatedBook = existingBook;

        return updatedBook;
    },

    create(payload){
        return Book.create(payload).then((created) =>
            Book.findById(created._id));
    },

    delete(id){
        return Book.findByIdAndDelete(id);
    }
};