const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');

// Defines the Post type
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: { type: GraphQLString },
    tags: { type: GraphQLList(GraphQLString) }
  })
});

// Defines the User type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  })
});

// Define the root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    posts: {
      type: GraphQLList(PostType),
      resolve(parent, args, { postsCollection }) {
        return postsCollection.find({}).toArray();
      }
    },
    users: {
      type: GraphQLList(UserType),
      resolve(parent, args, { usersCollection }) {
        return usersCollection.find({}).toArray();
      }
    },
    postsByTag: {
      type: GraphQLList(PostType),
      args: {
        tags: { type: GraphQLList(GraphQLString) }
      },
      resolve(parent, { tags }, { postsCollection }) {
        return postsCollection.find({ tags: { $in: tags } }).toArray();
      }
    },
    userByUsername: {
      type: UserType,
      args: {
        username: { type: GraphQLString }
      },
      resolve(parent, { username }, { usersCollection }) {
        return usersCollection.findOne({ username });
      }
    }
  }
});

// Defines the root Mutation
const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createPost: {
      type: PostType,
      args: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: GraphQLString },
        tags: { type: GraphQLList(GraphQLString) }
      },
      resolve(parent, { title, content, author, tags }, { postsCollection }) {
        const post = {
          title,
          content,
          author,
          tags,
          created_at: new Date()
        };
        return postsCollection.insertOne(post).then((result) => {
          const insertedPost = result.ops[0];
          return {
            _id: insertedPost._id,
            title: insertedPost.title,
            content: insertedPost.content,
            author: insertedPost.author,
            tags: insertedPost.tags,
            created_at: insertedPost.created_at
          };
        });
      }
    },

    createUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, { username, email, password }, context) {
        const usersCollection = context.usersCollection;
        const user = {
          username,
          email,
          password,
          created_at: new Date()
        };
        return usersCollection.insertOne(user).then((result) => result.ops[0]);
      }
    },    
    deletePost: {
      type: GraphQLString,
      args: {
        postId: { type: GraphQLString }
      },
      resolve(parent, { postId }, { postsCollection }) {
        return postsCollection
          .deleteOne({ _id: postId })
          .then(() => `Post with ID ${postId} successfully deleted`)
          .catch(() => `Error deleting post with ID ${postId}`);
      }
    },
    updateUser: {
      type: UserType,
      args: {
        userId: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, { userId, username, email, password }, { usersCollection }) {
        const updatedUser = {
          username,
          email,
          password
        };
        return usersCollection.findOneAndUpdate(
          { _id: userId },
          { $set: updatedUser },
          { returnOriginal: false }
        );
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
