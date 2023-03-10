const { User } = require('../models');

const getByEmail = async (email) => {
  const allUsers = await User.findOne({ where: { email } });
  return allUsers;
};

const create = async (user) => {
  const createdUser = await User.create(user);
  return createdUser;
};

const getById = async (id) => {
  const user = await User.findOne({ where: { id } });
  return user;
};

const getAll = async () => {
  const allUsers = await User.findAll({ attributes: { exclude: ['password'] } });
  return allUsers;
};

const remove = async (id) => {
  await User.destroy({ where: { id } });
};

module.exports = {
  getByEmail,
  create,
  getById,
  getAll,
  remove,
};
