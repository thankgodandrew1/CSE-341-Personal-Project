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
      const post = await postsCollection.find({ tags: req.params.tags }).toArray();
      if (!post) {
        return res.status(404).send('No posts found with the specified tag');
      }
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  const createPost = async (req, res) => {
    try {
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
  return { getPosts, getPostsByTag, createPost };
};