// File: controllers/auth.controller.js
const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const signup = async (req, res) => {
    try {
        var newUser = new User({ ...req.body, role: 'user' });
        var user = await newUser.save();
        console.log("user", user);
        res.json({ msg: "signupsuccess" });
    } catch (error) {
        res.json({ msg: "signup failed" });
    }
};

const login = async (req, res) => {
    await console.log(req.body);
    try {
        var user = await User.findOne({ username: req.body.username, password: req.body.password });
        if (!user) {
             return res.json({ msg: "login failed" });
        }
        var token = jwt.sign({ ...user }, JWT_SECRET);
        res.json({ msg: "loginsuccess", token, role: user.role });
    } catch (error) {
        res.json({ msg: "login failed" });
    }
};

module.exports = {
    signup,
    login
};