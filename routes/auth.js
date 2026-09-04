const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
});

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }
//   const token = jwt.sign({ userId: user._id, name: user.name }, 'SECRET_KEY');
//   res.json({ token, userId: user._id, name: user.name });
// });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        code: 'USER_NOT_FOUND',
        error: 'Account not found. Please create an account to log in.' 
      });
    }

    // 2. Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        code: 'INVALID_CREDENTIALS',
        error: 'Incorrect password. Please try again.' 
      });
    }

    // 3. Generate token & return success response
    const token = jwt.sign({ userId: user._id, name: user.name }, 'SECRET_KEY');
    res.json({ token, userId: user._id, name: user.name });

  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;