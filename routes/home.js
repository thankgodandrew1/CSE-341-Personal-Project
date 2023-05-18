const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');

// Define a route for the home page that uses the `getHome` function from the `homeController`
router.get('/', homeController.getHome);

// Export the router so it can be used in other parts of the application
module.exports = router;
