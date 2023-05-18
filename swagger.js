const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/usersRoute.js', './routes/postsRoute.js'];

const docs = {
    info: {
      title: 'Social Media Users and Posts API',
      version: '1.0.0',
      description: 'An API to manage Users and Posts'
    },
    host: 'cse-web-service.onrender.com',
    schemes: ['https']
  };

swaggerAutogen(outputFile, endpointsFiles, docs).then(() => {
  console.log('Swagger documentation has been generated successfully!');
}).catch((error) => {
  console.error(error);
});