exports.getHome = (req, res) => {
  const loginLink = 'https://cse-web-service.onrender.com/login';
  const logoutLink = 'https://cse-web-service.onrender.com/logout';

  if (req.isAuthenticated()) {
    // sends if Users is logged in
    res.send(
      `Hello, ${req.user.displayName}! Welcome to my Node API ⚓<br/><a href="${logoutLink}" style="position: absolute; top: 10px; right: 10px; color: white; background-color: red; padding: 10px; text-decoration: none; border-radius: 8px; font-weight:bold">Logout</a>`
    );
  } else {
    // srnds to the browser if not looged in
    res.send(
      `Hello World! Welcome to my Node API ⚓<br/><a href="${loginLink}" style="position: absolute; top: 10px; right: 10px; color: white; background-color: blue; padding: 10px; text-decoration: none; border-radius: 8px; background-image: linear-gradient(to right, lightblue, blue, #008CBA); font-weight:bold">Login</a>`
    );
  }
};
