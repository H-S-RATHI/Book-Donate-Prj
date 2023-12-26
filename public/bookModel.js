// Importing the Mongoose library
const mongoose = require("mongoose");

// Defining the schema for the 'Book' model
const bookSchema = new mongoose.Schema({
  // Title of the book, a required field
  title: {
    type: String,
    required: true,
  },
  // Author of the book, a required field
  author: {
    type: String,
    required: true,
  },
  // Genre of the book, a required field
  genre: {
    type: String,
    required: true,
  },
  // Year of publication of the book, a required field of type Date
  year: {
    type: Date,
    required: true,
  },
  // ISBN (International Standard Book Number) of the book, a required field
  isbn: {
    type: String,
    required: true,
  },
  // User details associated with the book, including name, email, and phone
  user: {
    name: String,
    email: String,
    phone: String,
  },
});

// Creating a Mongoose model named 'Book' based on the defined schema
const Book = mongoose.model("Book", bookSchema);

// Exporting the 'Book' model to be used in other parts of the application
module.exports = Book;
