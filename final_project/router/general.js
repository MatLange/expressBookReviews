const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const message = JSON.stringify(books, null, 4);
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  if (isbn > 0) {
    const book = books[isbn];
    return res.status(300).json(book);
  }
  return res.status(400).json({message: "No valid ISBN number provided"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    if (!author) {
        return res.status(400).json({message: "No valid author provided"});
    }
    const filteredBooks = {};
    Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
            filteredBooks[key] = books[key];
        }
    });
    return res.status(300).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    if (!title) {
        return res.status(400).json({message: "No valid title provided"});
    }
    const filteredBooks = {};
    Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
            filteredBooks[key] = books[key];
        }
    });
    return res.status(300).json(filteredBooks);
});
 
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
