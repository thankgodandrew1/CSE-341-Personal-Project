//server.js entry point
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const homeRoute = require('./routes/home');
const usersRoute = require('./routes/usersRoute');
const postsRoute = require('./routes/postsRoute');

const db = require('./database/db');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const app = express();
const port = process.env.PORT || 8080;

dotenv.config();

// Enabled CORS for all requests
app.use(cors());

db.connect()
  .then((database) => {
    const usersCollection = database.usersCollection;
    const postsCollection = database.postsCollection;

    app.locals.usersCollection = usersCollection;
    app.locals.postsCollection = postsCollection;
    app.use(express.json());

    // pass the users collection to the users route
    app.use('/users', usersRoute(usersCollection));

    // pass the posts collection to the posts route
    app.use('/posts', postsRoute(postsCollection));

    // use the home route for all other routes
    app.use('/', homeRoute);

    app.use((req, res, next) => {
      const error = new Error('Not found');
      error.status = 404;
      next(error);
    });

    app.use((error, req, res, next) => {
      res.status(error.status || 500);
      res.json({
        error: {
          message: error.message
        }
      });
    });

    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });

  // used the swagger UI to serve API documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));