const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { validateRoutes } = require('../validator/validate');
const isAuthenticated = require('../middlewares/isAuthenticated')

module.exports = (postsCollection) => {
  const { getPosts, getPostsByTag, createPost, updatePosts, deletePosts } =
    postsController(postsCollection);

  router.get('/', isAuthenticated, getPosts);

  router.get('/:tags', isAuthenticated, getPostsByTag);

  router.post('/', isAuthenticated, validateRoutes('createPost'), createPost);

  router.put('/:id', isAuthenticated, validateRoutes('updatePosts'), updatePosts);

  router.delete('/:id', isAuthenticated, deletePosts);

  // Added Error handler to router
  router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server error');
  });

  return router;
};
