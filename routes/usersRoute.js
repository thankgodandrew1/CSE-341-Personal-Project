const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { validateRoutes } = require('../validator/validate');

module.exports = (usersCollection) => {
  const { getUsers, getUserByUsername, createUser, updateUser, deleteUser } =
    usersController(usersCollection);

  router.get('/', getUsers);

  router.get('/:username', getUserByUsername);

  router.post('/', validateRoutes('createUser'), createUser);

  router.put('/:id', validateRoutes('updateUser'), updateUser);

  router.delete('/:id', deleteUser);

  // Added Error handler to router
  router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server error');
  });

  return router;
};
