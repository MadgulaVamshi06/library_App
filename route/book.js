const express = require('express');
const Book = require('../model/book.model');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new book
router.post('/', auth(['CREATOR']), async (req, res) => {
  const { title, author } = req.body;
  try {
    const newBook = new Book({
      title,
      author,
      creator: req.user.user.id,
    });
    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// View books created by the user or all books depending on the user's roles
router.get('/', auth(['VIEWER', 'VIEW_ALL']), async (req, res) => {
  const { old, new: newBooks } = req.query;
  const query = {};
  
  if (old) {
    query.createdAt = { $lte: new Date(Date.now() - 10 * 60 * 1000) };
  } else if (newBooks) {
    query.createdAt = { $gt: new Date(Date.now() - 10 * 60 * 1000) };
  }

  if (req.user.roles.includes('VIEW_ALL')) {
    try {
      const books = await Book.find(query);
      res.json(books);
    } catch (err) {
      res.status(500).send('Server error');
    }
  } else {
    query.creator = req.user.user.id;
    try {
      const books = await Book.find(query);
      res.json(books);
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
});

// Delete a book
router.delete('/:id', auth(['CREATOR']), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.creator.toString() !== req.user.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    await book.remove();
    res.json({ message: 'Book removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
