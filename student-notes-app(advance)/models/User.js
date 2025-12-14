const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');//bcryptjs is used to hash passwords so we never store plain text passwords (for security).

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash the  password before saving
UserSchema.pre('save', async function (next) {//UserSchema.pre('save', ...)This means:Before the document is saved into MongoDB .Run this function
    if (!this.isModified('password')) return next();//If user updates something else (like email), we don’t want to re-hash the password again .So only hash when password is NEW or CHANGED.

    this.password = await bcrypt.hash(this.password, 10); // hashed the password then we'll go ahead and save the user
    next();
});

module.exports = mongoose.model('User', UserSchema);
