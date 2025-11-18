// File: controllers/interest.controller.js
const Intrestrate = require("../models/intrestrate.model");

const getInterestRates = async (req, res) => {
    try {
        var intrestrates = await Intrestrate.find();
        console.log("iiii", intrestrates);
        if (intrestrates.length > 0) {
            var data = {
                id: intrestrates[0]._id,
                intrestrates: intrestrates[0].intrestrates
            };
            res.send(data);
        } else {
            res.json({ msg: "no intrestrates found" });
        }
    } catch (error) {
        res.json({ msg: "error in finding intrestrates" });
    }
};

const addInterestRates = async (req, res) => {
    try {
        var intrestratesdata = new Intrestrate(req.body);
        intrestratesdata.intrestrates.push(req.body);
        console.log(intrestratesdata);
        await intrestratesdata.save();
        res.json({ msg: "intrestrates added" });
    } catch (error) {
        res.json({ msg: "err in adding intrestrates" });
    }
};

const updateInterestRate = async (req, res) => {
    try {
        var intrestrate = req.body;
        await Intrestrate.findOneAndUpdate({ _id: req.params.id }, { $push: { intrestrates: intrestrate } });
        res.json({ msg: "intrestrate updated" });
    } catch (error) {
        res.json({ msg: " error in updating intrestrate" });
    }
};

module.exports = {
    getInterestRates,
    addInterestRates,
    updateInterestRate
};