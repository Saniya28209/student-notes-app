const express = require('express');
const bcrypt = require('bcryptjs');//importing this module to  compare the login pass with hash pass.
const User = require('../models/User'); // importing the user model 
const router = express.Router();

// Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register User
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;// user's input

    await User.create({ username, email, password });//user's data getting stored in mongodb.
    res.redirect('/login');
});

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });//finding user by e-mail
    if (!user) return res.send("User not found");//if not found

    const isMatch = await bcrypt.compare(password, user.password);//comparing input pass with actual user pass
    if (!isMatch) return res.send("Incorrect password");

    // Save user in session
    req.session.userId = user._id;// if pass and e-mail both are correct.This also keeps user logged in until they log out.

    res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();// deletes the session,logs the user out .
    res.redirect('/login');
});

module.exports = router;
