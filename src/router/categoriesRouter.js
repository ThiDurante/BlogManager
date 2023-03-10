const express = require('express');
const jwtValidate = require('../middleware/jwtValidate');
const categoriesController = require('../controllers/categoriesController');

const categoriesRouter = express.Router();

categoriesRouter.post('/', jwtValidate, categoriesController.create);
categoriesRouter.get('/', jwtValidate, categoriesController.getAll);

module.exports = categoriesRouter;