document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');

  try {
    const res = await fetch('/auth/signup', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = '/todo.html';
    } else {
      msg.textContent = data.error || 'Signup failed';
    }
  } catch (err) {
    msg.textContent = 'Server error';
  }
});