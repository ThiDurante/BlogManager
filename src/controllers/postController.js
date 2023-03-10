const postService = require('../service/postService.js');

const create = async (req, res) => {
  const { userId } = req.user.data;
  const createdCategory = await postService.create(req.body, userId);
  if (createdCategory.message !== undefined) {
    return res.status(400).json(createdCategory);
  }
  return res.status(201).json(createdCategory);
};

const getAll = async (_req, res) => {
  const allPosts = await postService.getAll();
  return res.status(200).json(allPosts);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const post = await postService.getById(id);
  if (Object.keys(post).length < 1) {
    return res.status(404).json({
      message: 'Post does not exist',
  }); 
  }
  return res.status(200).json(post);
};

const update = async (req, res) => {
  const { userId } = req.user.data;
  const { id } = req.params;
  const post = await postService.getById(id);
  if (userId !== post.userId) {
    return res.status(401).json({
      message: 'Unauthorized user',
    });
  }
  try {
    const { title, content } = req.body;
    if (!title || !content) throw Object({});
    const updatedPost = await postService.update(id, title, content);
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(400).json({
      message: 'Some required fields are missing',
    }); 
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user.data;
  const deletedPost = await postService.remove(userId, id);
  if (deletedPost.message) {
    if (deletedPost.message.includes('Unauthorized')) {
      return res.status(401).json(deletedPost);
    } 
      return res.status(404).json(deletedPost);
  }
  return res.status(204).json(deletedPost);
};

const getSearch = async (req, res) => {
  const searchValue = req.query.q;
  if (!searchValue) {
    const result = await postService.getAll();
    return res.status(200).json(result);
  }
  let result = await postService.getSearch(searchValue);
  if (!result) result = [];
  return res.status(200).json(result);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  getSearch,
};