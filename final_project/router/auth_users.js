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
  return res.status(300).json({ message: "Yet to be imple" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
