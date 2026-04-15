import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        isbn: {type: String, required: true, trim: true, unique: true},
        title: { type: String, required: true, trim: true, minlength: 5},
        author: {type: String, requried: true, trim: true, minlength: 2},
        description: { type: String, required: false, minlength: 10},
        genre: {
            type: String,
            required: true,
            enum: ["fiction", "non_fiction"],
            default: "fiction"
        },
        publishedDate: {
            type: Date,
            required: true
        },
        quantity: {
            type: Number,
            min:1,
            required: true
        },
        price: {
            type: Number,
            min:0,
            required: true
        },
        coverImg:{
            type: String,
            required: false
        }
    },
    {timestamps: true}
);

bookSchema.index({title: "text"});

export const Book = mongoose.model("Book", bookSchema);