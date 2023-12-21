const express = require("express");
const mongoose = require("mongoose");
const Book = require("./public/bookModel");

const app = express();
app.use(express.json());
app.use(express.static("public"));
// Base route
app.get("/", function (req, res) {
  res.send("Welcome to our Bookstore API!");
});

mongoose
  .connect(
    "mongodb+srv://12345678:A7zdJaK1wtVTly62@atlascluster.zwpd8k7.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.post("/books", async (req, res) => {
  try {
    const { title, author, genre, year, isbn, user } = req.body;
    const book = new Book({ title, author, genre, year, isbn, user });
    const savedBook = await book.save();
    res.json(savedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, year, isbn } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, year, isbn },
      { new: true }
    );
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    res.json(deletedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
