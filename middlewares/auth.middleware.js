// File: middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const { JWT_SECRET } = require('../config/config');

const adminManagerAuthenticate = async (req, res, next) => {
    try {
        var token = req.headers.authorization;
        if (!token) {
            return res.json({ msg: "token missing" });
        }
        var decoded = jwt.verify(token, JWT_SECRET);
        var user = await User.findById(decoded._doc._id);
        if (!user) {
            return res.json({ msg: "user not found" });
        }
        if (user.role === 'admin' || user.role === 'manager') {
            next();
        } else {
            return res.json({ msg: "you dont have access" });
        }
    } catch (error) {
        res.json({ message: 'Invalid token' });
    }
};

const adminauthenticate = async (req, res, next) => {
    try {
        var token = req.headers.authorization;
        if (!token) {
            return res.json({ msg: "token missing" });
        }
        var decoded = jwt.verify(token, JWT_SECRET);
        var user = await User.findById(decoded._doc._id);
        if (!user) {
            return res.json({ msg: "user not found" });
        }
        if (user.role === 'admin') {
            next();
        } else {
            return res.json({ msg: "you dont have access admin required" });
        }
    } catch (error) {
        res.json({ message: 'Invalid token' });
    }
};

const userauthenticate = async (req, res, next) => {
    try {
        var token = req.headers.authorization;
        if (!token) {
            return res.json({ msg: "token missing" });
        }
        var decoded = jwt.verify(token, JWT_SECRET);
        var user = await User.findById(decoded._doc._id);
        if (!user) {
            return res.json({ msg: "user not found" });
        }
        if (user.role === 'user') {
            req.mobile = user.mobile;
            next();
        } else {
            return res.json({ msg: "you dont have access" });
        }
    } catch (error) {
        res.json({ message: 'Invalid token' });
    }
};

module.exports = {
    adminManagerAuthenticate,
    adminauthenticate,
    userauthenticate
};