const categoriesService = require('../service/categoriesService');

const create = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: '"name" is required',
  }); 
  }
  const createdCategory = await categoriesService.create(req.body);
  return res.status(201).json(createdCategory);
};

const getAll = async (req, res) => {
  const allCategories = await categoriesService.getAll();
  return res.status(200).json(allCategories);
};

module.exports = {
  create,
  getAll,
};