const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

module.exports = (usersCollection) => {
  const { getUsers, getUserByUsername, createUser } = usersController(usersCollection);

  router.get('/', getUsers);

  router.get('/:username', getUserByUsername);

  router.post('/', createUser);

  return router;
};
