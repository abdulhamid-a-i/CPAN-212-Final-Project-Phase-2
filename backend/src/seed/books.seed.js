import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/db.js";
import { Book } from "../models/Book.js";

async function seedBooks() {
  try {
    await connectDatabase();

    await Book.deleteMany({});

    await Book.insertMany([
        {  
            isbn: "9780743437318",
            title: "Pendragon: The Merchant of Death",
            author: "D.J. MacHale",
            description: "The first book in D.J. MacHale’s New York Times bestselling middle grade fantasy series about Bobby Pendragon, a regular kid who finds himself and his two friends pulled into epic adventures across worlds!\n\nBobby Pendragon is a seemingly normal fourteen-year-old boy. He has a family, a home, and even Marley, his beloved dog. But there is something very special about Bobby.\n\nHe is going to save the world.\n\nAnd not just Earth as we know it. Bobby is slowly starting to realize that life in the cosmos isn’t quite what he thought it was. And before he can object, he is swept off to an alternate dimension known as Denduron, a territory inhabited by strange beings, ruled by a magical tyrant, and plagued by dangerous revolution.\n\nIf Bobby wants to see his family again, he’s going to have to accept his role as savior—and accept it wholeheartedly. Because, as he is about to discover, Denduron is only the beginning",
            genre: "fiction",
            publishedDate: "09/01/2002",
            quantity: 53,
            price: 14.99,
            coverImg: "https://dynamic.indigoimages.ca/v1/books/books/0743437314/1.jpg"
        },
                {  
            isbn: "9780807014271",
            title: "Man's Search for Meaning",
            author: "Viktor Frankl",
            description: "This seminal book, which has been called “one of the outstanding contributions to psychological thought” by Carl Rogers and “one of the great books of our time” by Harold Kushner, has been translated into more than fifty languages and sold over sixteen million copies. “An enduring work of survival literature,” according to the New York Times, Viktor Frankl’s riveting account of his time in the Nazi concentration camps, and his insightful exploration of the human will to find meaning in spite of the worst adversity, has offered solace and guidance to generations of readers since it was first published in 1946. At the heart of Frankl’s theory of logotherapy (from the Greek word for “meaning”) is a conviction that the primary human drive is not pleasure, as Freud maintained, but rather the discovery and pursuit of what the individual finds meaningful. Today, as new generations face new challenges and an ever more complex and uncertain world, Frankl’s classic work continues to inspire us all to find significance in the very act of living, in spite of all obstacles.\n\nA must-read companion to this classic work, a new, never-before-published work by Frankl entitled Yes to Life: In Spite of Everything, is now available in English.",
            genre: "non_fiction",
            publishedDate: "06/01/2006",
            quantity: 59,
            price: 21.99,
            coverImg: "https://dynamic.indigoimages.ca/v1/books/books/0807014273/1.jpg"
        }

    ])



    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed users:", error);
    process.exit(1);
  }
}

seedBooks();