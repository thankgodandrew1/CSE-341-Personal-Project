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
  return { getUsers, getUserByUsername, createUser }
};
