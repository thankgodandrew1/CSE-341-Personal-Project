const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

module.exports = (usersCollection) => {
  const { getUsers, getUserByUsername, createUser, updateUser, deleteUser } = usersController(usersCollection);

  router.get('/', getUsers);

  router.get('/:username', getUserByUsername);

  router.post('/', createUser);

  router.put('/:id', updateUser);

  router.delete('/:id', deleteUser);

  return router;
};
