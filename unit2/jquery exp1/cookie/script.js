document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const msg = document.getElementById('loginMsg');

  try {
    const res = await fetch('/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = '/todo.html';
    } else {
      msg.textContent = data.error || 'Login failed';
    }
  } catch (err) {
    msg.textContent = 'Server error';
  }
});