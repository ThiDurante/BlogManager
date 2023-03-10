const { Category } = require('../models');

const create = async (name) => {
  const createdCategory = await Category.create(name);
  return createdCategory;
};

const getAll = async () => {
  const allCategories = await Category.findAll();
  return allCategories;
};

const getById = async (categoryId) => {
  const category = await Category.findOne({ where: { id: categoryId } });
  return category;
};

module.exports = {
  create,
  getAll,
  getById,
};