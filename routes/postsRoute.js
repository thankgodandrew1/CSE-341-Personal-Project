const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { validateRoutes } = require('../validator/validate');

module.exports = (postsCollection) => {
  const { getPosts, getPostsByTag, createPost, updatePosts, deletePosts } =
    postsController(postsCollection);

  router.get('/', getPosts);

  router.get('/:tags', getPostsByTag);

  router.post('/', validateRoutes('createPost'), createPost);

  router.put('/:id', validateRoutes('updatePosts'), updatePosts);

  router.delete('/:id', deletePosts);

  // Added Error handler to router
  router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server error');
  });

  return router;
};
