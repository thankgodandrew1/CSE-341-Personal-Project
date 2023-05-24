const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

module.exports = (postsCollection) => {
  const { getPosts, getPostsByTag, createPost, updatePosts, deletePosts } = postsController(postsCollection);

  router.get('/', getPosts);

  router.get('/:tags', getPostsByTag);

  router.post('/', createPost);

  router.put('/:id', updatePosts);

  router.delete('/:id', deletePosts)

  return router;
};
