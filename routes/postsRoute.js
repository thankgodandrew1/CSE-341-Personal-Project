const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

module.exports = (postsCollection) => {
  const { getPosts, getPostsByTag, createPost } = postsController(postsCollection);

  router.get('/', getPosts);

  router.get('/:tags', getPostsByTag);

  router.post('/', createPost);

  return router;
};