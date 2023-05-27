const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

module.exports = (postsCollection) => {
  const getPosts = async (req, res) => {
    try {
      const posts = await postsCollection.find({}).toArray();
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  const getPostsByTag = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { tags } = req.params;
      const tagList = tags.split(',');
  
      const posts = await postsCollection.find({ tags: { $in: tagList } }).toArray();
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found with the specified tags' });
      }
  
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  const createPost = async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const post = {
        ...req.body,
        created_at: new Date()
      };
      const result = await postsCollection.insertOne(post);
      res.status(201).json({ id: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const updatePosts = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await postsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const deletePosts = async (req, res) => {
    try {
      
      const result = await postsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deleteCount === 0) {
        return res.status(404).send('Post not found');
      }
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  return { getPosts, getPostsByTag, createPost, updatePosts, deletePosts };
};
