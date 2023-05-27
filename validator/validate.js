const { body } = require('express-validator');

exports.validateRoutes = (entity) => {
  switch (entity) {
    // Code for social media posts POST and PUT routers validation
    case 'createPost':
      return [
        body('title').notEmpty().withMessage('Title is required'),
        body('title')
          .isLength({ min: 5, max: 50 })
          .withMessage('Title must be between 5 and 50 characters'),
        body('content').notEmpty().withMessage('Content is required'),
        body('content')
          .isLength({ min: 10, max: 500 })
          .withMessage('Content must be between 10 and 1000 characters'),
        body('author').notEmpty().withMessage('Author is required'),
        body('author')
          .isAlphanumeric()
          .withMessage('Author must contain only alphanumeric characters')
      ];
    case 'updatePosts':
      return [
        body('title').notEmpty().withMessage('Title is required'),
        body('title')
          .isLength({ min: 5, max: 50 })
          .withMessage('Title must be between 5 and 50 characters'),
        body('content').notEmpty().withMessage('Content is required'),
        body('content')
          .isLength({ min: 10, max: 500 })
          .withMessage('Content must be between 10 and 500 characters'),
        body('author').notEmpty().withMessage('Author is required'),
        body('author')
          .isAlphanumeric()
          .withMessage('Author must contain only alphanumeric characters')
      ];

    // Code for social media users POST and PUT routers validation
    case 'createUser':
      return [
        body('username')
          .notEmpty()
          .withMessage('Username is required')
          .custom(async (value, { req }) => {
            const { usersCollection } = req.app.locals;
            const user = await usersCollection.findOne({ username: value });
            if (user) {
              throw new Error('Username already exists');
            }
          }),
        body('username')
          .isLength({ min: 3, max: 20 })
          .withMessage('Username must be between 3 and 20 characters'),
        body('email')
          .notEmpty()
          .withMessage('Email is required')
          .isEmail()
          .withMessage('Invalid email'),
        body('password')
          .notEmpty()
          .withMessage('Password is required')
          .isStrongPassword()
          .withMessage('Enter a strong password')
      ];
    case 'updateUser':
      return [
        body('username')
          .notEmpty()
          .withMessage('Username is required')
          .isLength({ min: 3, max: 20 })
          .withMessage('Username must be between 3 and 20 characters')
          .custom(async (value, { req }) => {
            const { usersCollection } = req.app.locals;
            const existingUser = await usersCollection.findOne({ username: value });
            if (existingUser && existingUser.id !== req.params.id) {
              throw new Error('USername is already taken');
            }
          }),
        body('email')
          .notEmpty()
          .withMessage('Email is required')
          .isEmail()
          .withMessage('Invalid email'),
        body('password')
          .notEmpty()
          .withMessage('Password is required')
          .isStrongPassword()
          .withMessage('Enter a strong password')
      ];

    default:
      throw new Error(`Invalid entity: ${entity}`);
  }
};
