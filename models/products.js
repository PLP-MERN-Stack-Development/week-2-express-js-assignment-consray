// models/products.js
const { v4: uuidv4 } = require('uuid');

let products = [
  // Existing data from your sample
];

const getAll = () => products;

const getById = (id) => products.find(p => p.id === id);

const create = (productData) => {
  const newProduct = { id: uuidv4(), ...productData };
  products.push(newProduct);
  return newProduct;
};

const update = (id, data) => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data };
  return products[index];
};

const remove = (id) => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};