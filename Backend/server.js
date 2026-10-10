const express = require('express');
const session = require('express-session');
const path = require('path');

const db = require('./database/db');
const { setLocals } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      'college-events-super-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  })
);

// Template locals and flash messages
app.use(setLocals);

// Application routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

// Homepage
// A simple response avoids requiring views/index.ejs
// while testing the deployed backend.
app.get('/', (req, res) => {
  res.status(200).send(
    'College Event Management System API is running!'
  );
});

// 404 handler (no EJS template required)
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('==============================================');
  console.log('College Event Management System is running!');
  console.log(`Port: ${PORT}`);
  console.log('==============================================');
});
