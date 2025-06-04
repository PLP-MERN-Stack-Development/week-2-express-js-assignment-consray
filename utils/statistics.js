// utils/statistics.js
const { getAll } = require('../models/products');

const getStats = () => {
  const products = getAll();
  const total = products.length;
  const byCategory = {};

  products.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });

  return {
    total,
    byCategory
  };
};

module.exports = getStats;