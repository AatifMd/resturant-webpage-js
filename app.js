document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = 'admin.html';
      } else {
        document.getElementById('error-message').innerText = 'Login failed. Please check your credentials.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('error-message').innerText = 'An error occurred. Please try again later.';
    });
  });
  