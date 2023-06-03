const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { validateRoutes } = require('../validator/validate');
const isAuthenticated = require('../middlewares/isAuthenticated')


module.exports = (usersCollection) => {
  const { getUsers, getUserByUsername, createUser, updateUser, deleteUser } =
    usersController(usersCollection);

  router.get('/', isAuthenticated, getUsers);

  router.get('/:username', isAuthenticated, getUserByUsername);

  router.post('/', isAuthenticated, validateRoutes('createUser'), createUser);

  router.put('/:id', isAuthenticated, validateRoutes('updateUser'), updateUser);

  router.delete('/:id', isAuthenticated, deleteUser);

  // Added Error handler to router
  router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server error');
  });

  return router;
};
