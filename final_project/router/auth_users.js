const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let valid_users = users.filter((user) => user.username === user);
  if(valid_users){
    return true;
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  if(isValid(username)){
    let valid_user = users.filter((user) => (user.username === username) && (user.password === password));
    if(valid_user){
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if(!authenticatedUser(username, password)){
    return res.status(403).json({message: "User not athenticated."});
  }

  let accessToken = jwt.sign({
    data: username
  }, 'access', {expiresIn: 60 * 60});

  req.session.authorization = {
    accessToken
  }

  res.send("User logged in succesfully!");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let userd = req.session.username;
  const isbn = req.params.isbn;
  let details = req.query.reviews;
  let rev = {user: userd, review: details};
  books[isbn].reviews = rev;

  return res.status(201).json({message: "Review added succesfully!"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  books[ISBN].reviews = {}
  return res.status(200).json({messsage:"Review has been deleted"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
