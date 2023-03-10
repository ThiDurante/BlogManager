require('dotenv/config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const userService = require('../service/userService.js');

const userSchema = Joi.object({
  displayName: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  image: Joi.string(),
});

const secret = process.env.JWT_SECRET;

const isBodyValid = (email, password) => email && password;

const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

const generateToken = (userId) => {
  const token = jwt.sign({ data: { userId } }, secret, jwtConfig);
  return token;
};

const isUserValid = (newUser) => {
  const { error } = userSchema.validate(newUser);
  if (error) {
    return { message: error.message };
  }
  return {};
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isBodyValid(email, password)) {
      return res.status(400).json({ message: 'Some required fields are missing' });
    }
    const user = await userService.getByEmail(email);
    if (!user || password !== user.password) {
      return res.status(400).json({ message: 'Invalid fields' });
    }
    const token = generateToken(user.id);
    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const newUser = req.body;
    const validateUser = isUserValid(newUser);
    if (validateUser.message !== undefined) {
      return res.status(400).json({ message: validateUser.message });
    }
    const user = await userService.getByEmail(req.body.email);
    if (user) {
      return res.status(409).json({ message: 'User already registered' });
    }
    const createdUser = await userService.create(newUser);
    const token = generateToken(createdUser.id);
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500)
      .json({ message: 'Erro interno', error: err.message });
  }
};

const getAll = async (_req, res) => {
  const allUsers = await userService.getAll();
  return res.status(200).json(allUsers);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getById(id);
  if (user) {
    delete user.dataValues.password;
    return res.status(200).json(user); 
}
  return res.status(404).json({
    message: 'User does not exist',
  });
};

const remove = async (req, res) => {  
  const { userId } = req.user.data;
  // if (+userId !== +id) {
  //   return res.status(401).json({
  //     message: 'Unauthorized user',
  //   });
  // }
  await userService.remove(userId);
  return res.status(204).end();
};

module.exports = {
  login,
  create,
  getAll,
  getById,
  remove,
};
