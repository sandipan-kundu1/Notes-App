require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const passport = require('passport');
const cors = require('cors');

const app = express();

// Passport config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Notes App API is running!' });
});

app.use('/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));