const { BlogPost, Category, PostCategory, User } = require('../models');

const isBodyValid = ({ title, content, categoryIds }) => 
  title && content && Array.isArray(categoryIds); 

const insertIntoPostCategory = async (categoryIds, postId) => {
  await Promise.all(categoryIds
    .map((categoryId) => PostCategory
        .create({ postId, categoryId })));
};

const checkCategories = async (categoryIds) => {
  if (categoryIds.length < 1) return false;
  const categories = await Promise.all(categoryIds
    .map((categoryId) => Category.findOne({ where: { id: categoryId } })));
  return categories.every((category) => category !== null);
};

const createPost = (body, userId) => {
  const newPost = body;
  newPost.userId = userId;
  newPost.published = new Date();
  newPost.updated = new Date();
  return newPost;
};

const create = async (body, userId) => {
  try {
    const { categoryIds } = body;
    if (!isBodyValid(body)) {
      return ({ message: 'Some required fields are missing' });
    }
    const checkCat = await checkCategories(categoryIds);
    if (!checkCat) {
      return ({ message: 'one or more "categoryIds" not found' });
    }
    const newPost = createPost(body, userId);
    const createdPost = await BlogPost.create(newPost);
    await insertIntoPostCategory(categoryIds, createdPost.id);
    return createdPost;
  } catch (error) {
    return { message: error.message };
  }
};

const getAll = async () => {
  const allPosts = BlogPost
    .findAll({ include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } },
       { model: Category, as: 'categories', attributes: { exclude: ['PostCategory'] } }] });
  return allPosts;
};

const getById = async (id) => {
  const post = await BlogPost.findOne({ where: { id },
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } },
    { model: Category, as: 'categories', attributes: { exclude: ['PostCategory'] } }] });
    return post || {};
};

const update = async (id, title, content) => {
  await BlogPost.update({ title, content }, { where: { id } });
  const updatedPost = await getById(id);
  return updatedPost;
};

const remove = async (userId, id) => {
  const post = await getById(id);
  if (Object.keys(post).length < 1) {
    return {
      message: 'Post does not exist',
    };
  }
  if (+userId !== +post.userId) {
    return {
      message: 'Unauthorized user',
    };
  }
  const deletedPost = await BlogPost.destroy({ where: { id } });
  return deletedPost;
};

const getSearch = async (searchValue) => {
  const allResults = await getAll();
  const result = allResults
    .filter((post) => post.title.toLowerCase().includes(searchValue.toLowerCase()) 
      || post.content.toLowerCase().includes(searchValue.toLowerCase()));
    return result;
};

module.exports = {
  create,
  getById,
  getAll,
  update,
  remove,
  getSearch,
};