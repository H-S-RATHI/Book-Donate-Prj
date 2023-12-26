// Importing necessary modules and dependencies
const express = require("express");
const mongoose = require("mongoose");
const Book = require("./public/bookModel"); // Importing the Book model

// Creating an instance of the Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Serving static files from the "public" directory
app.use(express.static("public"));

// Base route
app.get("/", function (req, res) {
  res.send("Welcome to our Bookstore API!");
});

// Connecting to MongoDB database
mongoose
  .connect(
    "mongodb+srv://12345678:A7zdJaK1wtVTly62@atlascluster.zwpd8k7.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Route for creating a new book (POST)
app.post("/books", async (req, res) => {
  try {
    // Extracting data from the request body
    const { title, author, genre, year, isbn, user } = req.body;

    // Creating a new Book instance with the extracted data
    const book = new Book({ title, author, genre, year, isbn, user });

    // Saving the new book to the database
    const savedBook = await book.save();

    // Sending the saved book as a JSON response
    res.json(savedBook);
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
});

// Route for retrieving all books (GET)
app.get("/books", async (req, res) => {
  try {
    // Retrieving all books from the database
    const books = await Book.find();

    // Sending the list of books as a JSON response
    res.json(books);
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
});

// Route for updating a book by ID (PUT)
app.put("/books/:id", async (req, res) => {
  try {
    // Extracting book ID from the request parameters
    const { id } = req.params;

    // Extracting data to update from the request body
    const { title, author, genre, year, isbn } = req.body;

    // Updating the book in the database
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, year, isbn },
      { new: true }
    );

    // Sending the updated book as a JSON response
    res.json(updatedBook);
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
});

// Route for deleting a book by ID (DELETE)
app.delete("/books/:id", async (req, res) => {
  try {
    // Extracting book ID from the request parameters
    const { id } = req.params;

    // Deleting the book from the database
    const deletedBook = await Book.findByIdAndDelete(id);

    // Sending the deleted book as a JSON response
    res.json(deletedBook);
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
});

// Starting the Express server on port 3000
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
