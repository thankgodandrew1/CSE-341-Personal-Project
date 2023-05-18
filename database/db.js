const { MongoClient } = require('mongodb');

const connect = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection(process.env.USERS_COLLECTION_NAME);
    const postsCollection = db.collection(process.env.POSTS_COLLECTION_NAME);
    console.log('MongoDB connected!');
    return { usersCollection, postsCollection };
  } catch (error) {
    console.error(error);
    throw new Error('Unable to connect to MongoDB');
  }
};

module.exports = { connect };
