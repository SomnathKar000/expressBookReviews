const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  const newUser = { username, password };
  users.push(newUser);
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(300).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = Number(req.params.isbn);
  const book = books[isbn];
  if (book) {
    return res.status(300).json({ book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  let book;
  for (const id in books) {
    if (books[id].author === author) {
      book = books[id];
      break;
    }
  }
  if (book) {
    return res.status(300).json(book);
  } else {
    return res.status(404).json({ message: "Author could not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  let book;
  for (const id in books) {
    if (books[id].title === title) {
      book = books[id];
      break;
    }
  }
  if (book) {
    return res.status(300).json(book);
  } else {
    return res.status(404).json({ message: "Title could not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = Number(req.params.isbn);
  const review = books[isbn].reviews;
  if (review) {
    return res.status(300).json({ review });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
