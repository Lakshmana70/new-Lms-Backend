// File: controllers/admin.controller.js
const User = require("../models/user.model");

const getManagers = async (req, res) => {
    try {
        const users = await User.find();
        const data = users.map((user) => {
            var obj = { id: user._id, username: user.username, role: user.role };
            return obj;
        });
        res.send(data);
    } catch (error) {
        res.json({ msg: "Error in finding data" });
    }
};

const approveManager = async (req, res) => {
    try {
        const approvemanager = await User.findOneAndUpdate({ _id: req.params.id }, { $set: { role: "manager" } }, { new: true });
        res.json({ msg: "approved" });
    } catch (error) {
        res.json({ msg: "Error in approving manager" });
    }
};

const removeManager = async (req, res) => {
    try {
        const removemanager = await User.findOneAndUpdate({ _id: req.params.id }, { $set: { role: "user" } }, { new: true });
        res.json({ msg: "manager removed" });
    } catch (error) {
        res.json({ msg: "Error in removing manager" });
    }
};

module.exports = {
    getManagers,
    approveManager,
    removeManager
};