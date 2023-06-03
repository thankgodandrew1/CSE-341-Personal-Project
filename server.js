// server.js entry point
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

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

app.use(express.static('public'));

// This code block enables session management
app.use(
  session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
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
      callbackURL: 'http://localhost:8080/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Passport callback function fired');
      console.log(profile);
      return done(null, profile);
    }
  )
);

// Redirect the user to the Google OAuth authentication page
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// Google OAuth callback route
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
          message: error.message,
        },
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
