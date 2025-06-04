// routes/products.js
const express = require('express');
const { body, query } = require('express-validator');
const { getAll, getById, create, update, remove } = require('../models/products');
const getStats = require('../utils/statistics');

const router = express.Router();

// GET /api/products
router.get(
  '/',
  [
    query('category').optional().isString(),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1 }),
  ],
  (req, res, next) => {
    try {
      let products = getAll();

      // Filtering by category
      if (req.query.category) {
        products = products.filter(p => p.category === req.query.category);
      }

      // Search by product name
      if (req.query.search) {
        const term = req.query.search.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(term));
      }

      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;
      const pagedProducts = products.slice(startIndex, startIndex + limit);

      res.json(pagedProducts);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = getById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /api/products
router.post(
  '/',
  [
    body('name').isString().notEmpty(),
    body('description').isString().optional(),
    body('price').isNumeric(),
    body('category').isString().notEmpty(),
    body('inStock').isBoolean(),
  ],
  (req, res, next) => {
    try {
      // Validate and add
      const newProduct = create(req.body);
      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/products/:id
router.put(
  '/:id',
  [
    body('name').isString().notEmpty(),
    body('description').isString().optional(),
    body('price').isNumeric(),
    body('category').isString().notEmpty(),
    body('inStock').isBoolean(),
  ],
  (req, res) => {
    const updated = update(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  }
);

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const success = remove(req.params.id);
  if (!success) return res.status(404).json({ message: 'Product not found' });
  res.status(204).end();
});

// GET /api/products/stats
router.get('/stats', (req, res) => {
  const stats = getStats();
  res.json(stats);
});

module.exports = router;