// server.js entry point
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { graphqlHTTP } = require('express-graphql');

const homeRoute = require('./routes/home');
const usersRoute = require('./routes/usersRoute');
const postsRoute = require('./routes/postsRoute');
const logoutRoute = require('./routes/logoutRoute');

const db = require('./database/db');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const schema = require('./schemas/schema');
const isAuthenticated = require('./middlewares/isAuthenticated');

const app = express();
const port = process.env.PORT || 8080;

dotenv.config();

// Enabled CORS for all requests
app.use(cors());

app.use('/login', express.static('public'));

// This code block enables session management
app.use(
  session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serialize user object
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user object
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'https://cse-web-service.onrender.com/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Passport callback function fired');
      // console.log(profile);
      return done(null, profile);
    }
  )
);

app.use('/logout', isAuthenticated, logoutRoute);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to the Swagger API documentation
    res.redirect('/api-docs');
  }
);

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

    app.use('/', homeRoute);

    app.use(
      '/graphql',
      (req, res, next) => {
        if (!req.isAuthenticated()) {
          return res.redirect('/login');
        }
        next();
      },
      graphqlHTTP({
        schema: schema,
        context: {
          postsCollection: postsCollection,
          usersCollection: usersCollection
        },
        graphiql: true
      })
    );

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

// Use the swagger UI to serve API documentation
app.use(
  '/api-docs',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      // If thw user is not authenticated, it redirects to the login page
      return res.redirect('/login');
    }
    // if they are authenticated, the app proceeds to serve the Swagger UI
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);
