function initializeAuthentication() {
  const loginButton = document.getElementById('loginButton');
  const loginContainer = document.getElementById('loginContainer');

  loginButton.addEventListener('click', () => {
    // Redirect the user to the /auth/google route
    window.location.href = '/auth/google';
  });

  // Check if the user is authenticated
  fetch('/checkAuth')
    .then((response) => response.json())
    .then((data) => {
      if (!data.authenticated) {
        // User is not authenticated, show the login button
        loginContainer.style.display = 'block';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', initializeAuthentication);
