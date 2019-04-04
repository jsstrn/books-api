const uuid = require("uuid/v4");
const express = require("express");
const router = express.Router();
const { books } = require("../data/db.json");

const { Book, Author } = require("../models");

const filterBooksBy = (property, value) => {
  return books.filter(b => b[property] === value);
};

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.sendStatus(403);
  } else {
    if (authorization === "Bearer my-awesome-token") {
      next();
    } else {
      res.sendStatus(403);
    }
  }
};

router
  .route("/")
  .get(async (req, res) => {
    try {
      const books = await Book.findAll({ include: [{ model: Author }] });
      return res.json(books);
    } catch (err) {
      return res.status(500).send(err);
    }
  })
  .post(verifyToken, async (req, res) => {
    try {
      const [author] = await Author.findOrCreate({
        where: { name: req.body.author.name }
      });
      const book = await Book.create({ title: req.body.title });
      book.setAuthor(author);
      book.save();
      return res.status(201).json(book);
    } catch (err) {
      return res.status(500).json(err);
    }
  });

router
  .route("/:id")
  .put((req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (book) {
      res.status(202).json(req.body);
    } else {
      res.sendStatus(400);
    }
  })
  .delete((req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (book) {
      res.sendStatus(202);
    } else {
      res.sendStatus(400);
    }
  });

module.exports = router;
