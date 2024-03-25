const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const user = req.session.authorization.username;
    const isbn = req.params.isbn;
    if (!isbn) {
        return res.status(400).json({message: "No ISBN for the book provided"});
    }
    const review = req.query.review;
    if (review && user) {
        const book = books[isbn];
        if (book) {
          if (review) {
            const reviews = book["reviews"] || {};
            reviews[user] = review;
            books[isbn]["reviews"] = reviews;
            const message = `Review for book with ISBN ${isbn} added/modified for user ${user}.`;
            return res.status(300).json(message);
          }                   
        }
        return res.status(400).json({message: "No review for book with this ISBN found"});
    }    
    return res.status(400).json({message: "No review for the book provided"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.session.authorization.username;
    const isbn = req.params.isbn;
    if (isbn && user) {
        const book = books[isbn];
        if (book) {
            const reviews = book["reviews"] || {};
            reviews[user] = null;
            delete reviews[user];
            books[isbn]["reviews"] = reviews;
            const message = `Review for book with ISBN ${isbn} deleted for user ${user}.`;
            return res.status(300).json(message);
        }
        return res.status(400).json({message: "No review for book with this ISBN found"});
    }    
    return res.status(400).json({message: "No ISBN for the book provided"});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

