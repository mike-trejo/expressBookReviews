const Axios = require("axios");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    const present = users.filter((user) => user.username === username);
    if(present.length === 0){
      users.push({"username": req.body.username, "password": req.body.password});
      return res.status(201).json({message: "User register succesfully!"});
    }
    else{
      return res.status(400).json({message: "Already exists!"});
    }
  }
  else if(!username && !password){
    return res.status(400).json({message: "Bad request!"});
  }
  else if(!username || !password){
    return res.status(400).json({message: "Check username and password."});
  }
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
  //Write your code here
//  res.send(JSON.stringify(books, null, 4));
//});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  await res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
//  //Write your code here
//  const isbn = req.params.isbn;
//  res.send(books[isbn]);
// });

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) =>{
    
  const ISBN = req.params.isbn;
  const booksBasedOnIsbn = (ISBN) => {
      return new Promise((resolve,reject) =>{
        setTimeout(() =>{
          const book = books.find((b) => b.isbn === ISBN);
          if(book){
            resolve(book);
          }else{
            reject(new Error("Book not found"));
          }},1000);
      });        
  }
  booksBasedOnIsbn(ISBN).then((book) =>{
    res.json(book);
  }).catch((err)=>{
    res.status(400).json({error:"Book not found"})
  });
 });
  
// Get book details based on author
//public_users.get('/author/:author',function (req, res) {
//  //Write your code here
//  let new_books = {};
//  const new_author = req.params.author;
//  let i = 1;
//  for(let bookid in books){
//    if(books[bookid].author === new_author){
//        new_books[i++] = books[bookid];
//    }
//    res.send(JSON.stringify(new_books));
//  }
//});

// Get book details based on author
public_users.get('/author/:author',async (req, res) => {

  //using promises
  const author = req.params.author;
  const booksBasedOnAuthor = (auth) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const filteredbooks = books.filter((b) => b.author === auth);
            if(filteredbooks>0){
              resolve(filteredbooks);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });
    
            
    }
    booksBasedOnAuthor(author).then((book) =>{
      res.json(book);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    }); 
});

// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
//  //Write your code here
//  let new_books = {}
//  const re_title = req.params.title;
//  let i = 1;
//  for(bookid in books){
//      if(books[bookid].title === re_title ){
//        new_books[i++] = books[bookid]
//      }
//  }
//  res.send(JSON.stringify(new_books))  
//});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {  
  const title = req.params.title;
  const booksBasedOnTitle = (booktitle) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const filteredbooks = books.filter((b) => b.title === booktitle);
            if(filteredbooks>0){
              resolve(filteredbooks);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });         
    }
    booksBasedOnTitle(title).then((new_books) =>{
      res.json(new_books);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].review),null,4);
});

module.exports.general = public_users;
