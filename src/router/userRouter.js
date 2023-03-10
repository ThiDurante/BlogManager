const express = require('express');
const userController = require('../controllers/userController');
const jwtValidate = require('../middleware/jwtValidate');

const userRouter = express.Router();

userRouter.post('/', userController.create);
userRouter.get('/', jwtValidate, userController.getAll);
userRouter.get('/:id', jwtValidate, userController.getById);
userRouter.delete('/me', jwtValidate, userController.remove);

module.exports = userRouter;
