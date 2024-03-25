const express = require('express');
const axios = require('axios').default;

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const connectToURL = async (url)=>{
    const req = await axios.get(url);
    console.log(req);
}

let allBooksPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
},0)});

const asyncBooks = async ()=>{
    const req = await axios.get("bookstore.json");
    return req.data;
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user. Username and password must be provided"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    allBooksPromise.then((bookdata) => {
        const books = {"books": bookdata};
        const message = JSON.stringify(books, null, 4);
        return res.status(200).json(books);
    },
    (err) => { return res.status(400).json({message:"Error reading the books"}); });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    allBooksPromise.then((bookdata) => {
        const isbn = req.params.isbn;
        if (isbn) {
            const book = books[isbn];
            if (book) {
                return res.status(200).json(book);
            }
            return res.status(400).json({message: "No book with this ISBN found"});
        }
        return res.status(400).json({message: "No ISBN provided"});
    },
    (err) => { return res.status(400).json({message:"Error reading the books"}); });    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    allBooksPromise.then((bookdata) => {
        const author = req.params.author;
        if (!author) {
            return res.status(400).json({message: "No valid author provided"});
        }
        const filteredBooks = [];
        Object.keys(books).forEach((key) => {
            if (books[key].author === author) {
                const authorBook = {
                    "isbn": key,
                    "title":books[key].title,
                    "reviews":books[key].reviews
                }
                filteredBooks.push(authorBook);
            }
        });
        const booksbyAuthor = {"booksbyauthor": filteredBooks};        
        return res.status(200).json(booksbyAuthor);
    },
    (err) => { return res.status(400).json({message:"Error reading the books"}); });        
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    allBooksPromise.then((bookdata) => {
        const title = req.params.title;
        if (!title) {
            return res.status(400).json({message: "No valid title provided"});
        }
        const filteredBooks = [];
        Object.keys(books).forEach((key) => {
            if (books[key].title === title) {
                const titleBook = {
                    "isbn": key,
                    "author":books[key].author,
                    "reviews":books[key].reviews
                }
                filteredBooks.push(titleBook);
            }
        });
        const booksbyTitle = {"booksbytitle": filteredBooks};        
        return res.status(200).json(booksbyTitle);
    },
    (err) => { return res.status(400).json({message:"Error reading the books"}); });            
});
 
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
      const book = books[isbn];
      if (book) {
        return res.status(200).json(book["reviews"]);
      }
      return res.status(400).json({message: "No book with this ISBN found"});
  }    
  return res.status(400).json({message: "No ISBN provided"});
});

module.exports.general = public_users;
