// File: routes/loan.routes.js
const express = require('express');
const router = express.Router();
const { 
    adminManagerAuthenticate, 
    adminauthenticate, 
    userauthenticate 
} = require('../middlewares/auth.middleware');
const {
    getAllLoans,
    getLoanDetails,
    getUserLoanDetails,
    payEmi,
    addLoan,
    approveLoan,
    receiveDownPayment,
    disburseLoan
} = require('../controllers/loan.controller');

router.get("/", adminManagerAuthenticate, getAllLoans);
router.get("/loandetails/:id", adminManagerAuthenticate, getLoanDetails);
router.get("/userloandetails", userauthenticate, getUserLoanDetails);
router.put('/payemi/:loanId/:emiId', userauthenticate, payEmi);
router.post("/addloan", adminManagerAuthenticate, addLoan);
router.put("/approveloan/:id", adminauthenticate, approveLoan);
router.put("/downpaymentReceived/:id", adminManagerAuthenticate, receiveDownPayment);
router.put("/disburseloan/:id", adminauthenticate, disburseLoan);

module.exports = router;