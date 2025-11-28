// exp7/server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));

app.use(express.static(path.join(__dirname, 'public')));

// Set cookie
app.get('/set-cookie', (req, res) => {
  res.cookie('username', 'JohnDoe', { maxAge: 900000, httpOnly: true });
  res.send('Cookie has been set');
});

// Get cookie
app.get('/get-cookie', (req, res) => {
  const user = req.cookies['username'] || 'none';
  res.send(`Cookie Retrieved: ${user}`);
});

// Delete cookie
app.get('/delete-cookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie deleted');
});

// Session demo: count views
app.get('/session', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Welcome back! You visited ${req.session.views} times.`);
  } else {
    req.session.views = 1;
    res.send('Welcome to the session demo. Refresh to count visits.');
  }
});

// Destroy session
app.get('/destroy-session', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error destroying session');
    }
    res.send('Session destroyed');
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Experiment 7 server started on http://localhost:${PORT}`);
});
