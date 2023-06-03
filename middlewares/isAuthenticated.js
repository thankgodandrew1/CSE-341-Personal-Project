const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // This redirects the user to the login page if the user is not yet authenticated
};

module.exports = isAuthenticated;
