const express = require('express');
const postController = require('../controllers/postController');
const jwtValidate = require('../middleware/jwtValidate');

const postRouter = express.Router();

postRouter.post('/', jwtValidate, postController.create);
postRouter.get('/search', jwtValidate, postController.getSearch);
postRouter.get('/:id', jwtValidate, postController.getById);
postRouter.put('/:id', jwtValidate, postController.update);
postRouter.delete('/:id', jwtValidate, postController.remove);
postRouter.get('/', jwtValidate, postController.getAll);

module.exports = postRouter;