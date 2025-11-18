// File: routes/interest.routes.js
const express = require('express');
const router = express.Router();
const { 
    adminManagerAuthenticate, 
    adminauthenticate 
} = require('../middlewares/auth.middleware');
const {
    getInterestRates,
    addInterestRates,
    updateInterestRate
} = require('../controllers/interest.controller');

router.get("/intrestrates", adminManagerAuthenticate, getInterestRates);
router.post("/addintrestrates", adminauthenticate, addInterestRates);
router.put("/updateintrestrate/:id", adminauthenticate, updateInterestRate);

module.exports = router;