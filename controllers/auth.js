const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the incoming request data

    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      console.log('Username already taken:', req.body.username);
      return res.send('Username already taken.');
    }

    // Check if the email is already taken
    const emailInDatabase = await User.findOne({ email: req.body.email });
    if (emailInDatabase) {
      console.log('Email already taken:', req.body.email);
      return res.send('Email already taken.');
    }

    // Check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      console.log('Password and Confirm Password do not match');
      return res.send('Password and Confirm Password must match');
    }

    // Hash the password before saving to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // Create the new user
    const newUser = await User.create(req.body);
    console.log('New user created:', newUser);

    // Redirect to the sign-in page
    res.redirect('/auth/sign-in');
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.redirect('/');
  }
});
router.post('/sign-in', async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.');
    }
  
    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send('Login failed. Please try again.');
    }
  
    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };
  
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
  console.log('User logged in:', req.session.user);
});

module.exports = router;