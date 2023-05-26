const ObjectId = require('mongodb').ObjectId;
const { validationResult } = require('express-validator');

module.exports = (usersCollection) => {
  const getUsers = async (req, res) => {
    try {
      const users = await usersCollection.find({}).toArray();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  const getUserByUsername = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await usersCollection.findOne({ username: req.params.username });
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  const createUser = async (req, res) => {
    try {
      // Check for any validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = {
        ...req.body,
        created_at: new Date()
      };

      const result = await usersCollection.insertOne(user);
      res.status(201).json({ id: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  const updateUser = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await usersCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deleteCount === 0) {
        return res.status(404).send('Post not found');
      }
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  return { getUsers, getUserByUsername, createUser, updateUser, deleteUser };
};
