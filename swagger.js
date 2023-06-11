const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/usersRoute.js', './routes/postsRoute.js'];

// const clientId = process.env.CLIENT_ID;

const docs = {
  info: {
    title: 'Social Media Users and Posts API',
    version: '1.0.0',
    description: 'An API to manage Users and Posts'
  },
  host: 'cse-web-service.onrender.com',
  schemes: ['https', 'http'],
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      description: 'OAuth 2.0 authorization',
      flow: 'implicit',
      authorizationUrl: `https://cse-web-service.onrender.com/auth/google/callback`,
      scopes: {
        'read:user': 'Read user data',
        'write:user': 'Write user data',
        'read:post': 'Read post data',
        'write:post': 'Write post data'
      }
    }
  },
  security: [
    {
      OAuth2: ['read:user', 'write:user', 'read:post', 'write:post']
    }
  ]
};

swaggerAutogen(outputFile, endpointsFiles, docs)
  .then(() => {
    console.log('Swagger documentation has been generated successfully!');
  })
  .catch((error) => {
    console.error(error);
  });
