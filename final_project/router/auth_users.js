const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = "mysecretkey";

let users = [];

const isValid = (username) => {
  let user = users.find((e) => e.username === username);
  if (user) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let user = users.find(
    (e) => e.username === username && e.password === password
  );
  if (user) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!password || !username) {
    res.status(400).json({ error: "Username and password must be provided" });
  }
  if (!authenticatedUser(username, password)) {
    res.status(401).json({ error: "Invalid username or password" });
  }
  const token = jwt.sign({ username }, secretKey);

  req.session.secret = token;
  return res
    .status(300)
    .json({ message: "User logged in successfully", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.user.username;
  const isbn = Number(req.params.isbn);
  const review = req.headers.review;
  const book = books[isbn];
  if (!book) {
    res.status(404).json({ error: "Book not found" });
  }
  book.reviews = { ...book.reviews, [user]: review };
  return res.status(300).json({
    message: `the review for the book ${isbn} is been updated/deleted`,
  });
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = Number(req.params.isbn);
  const user = req.user.username;
  const book = books[isbn];
  if (!book) {
    res.status(404).json({ error: "Book not found" });
  }
  delete book.reviews[user];
  res.status(300).json({
    message: `review for the ${isbn} posted by the ${user} deleted`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
