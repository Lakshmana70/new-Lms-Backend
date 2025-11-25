// File: controllers/loan.controller.js
const Loan = require("../models/loan.model");
const {BASE_URL,DEVICE_ID,API_KEY} =require('../config/config');    
const axios=require("axios")
const getAllLoans = async (req, res) => {
    try {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10;
        var skip = (page - 1) * limit;
        var loans = await Loan.aggregate([
            { $sort: { updatedAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 1,
                    customerName: 1,
                    customerMobile: 1,
                    loanitem: 1,
                    productcost: 1,
                    status: 1
                }
            }
        ]);

        if (loans.length > 0) {
            res.send(loans);
        } else {
            res.json({ msg: "No loans found" });
        }
    } catch (error) {
        res.json({ msg: "Error in finding loans" });
    }
};

const getLoanDetails = async (req, res) => {
    try {
        var loandetails = await Loan.findOne({ _id: req.params.id });
        var { _id, typeofloan, loanitem, productcost, intrest, downpayment, customerMobile, customerName } = loandetails;
        var obj = {
            _id,
            typeofloan,
            loanitem,
            productcost,
            intrest,
            downpayment,
            customerMobile,
            customerName
        };
        res.send(obj);
    } catch (error) {
        res.json({ msg: "err in finding loan details" });
    }
};

const getUserLoanDetails = async (req, res) => {
    try {
        const loandetails = await Loan.findOne({ customerMobile: req.mobile });
        if (loandetails) {
            var { _id, emis } = loandetails;
            res.send({ _id, emis });
        } else {
            res.send({ msg: "no loan details found" });
        }
    } catch (error) {
        res.json({ msg: "err in finding user loan details" });
    }
};

const payEmi = async (req, res) => {
    const updatedLoan = await Loan.findOneAndUpdate(
        { _id: req.params.loanId, "emis._id": req.params.emiId },
        { $set: { "emis.$.emiStatus": "paid" } },
        { new: true }
    );
    if (updatedLoan) {
        res.json({ msg: "emi paid" });
    } else {
        res.json({ msg: "err in paying emi" });
    }
};

const addLoan = async (req, res) => {
    try {
        var newLoan = new Loan(req.body);
        newLoan.status.push({ code: "applied", timestamp: Date.now() });
        const newLoanuser = await newLoan.save();
        res.json({ msg: "loan added" });
    } catch (error) {
        res.json({ msg: "err in adding loan" });
    }
};

const approveLoan = async (req, res) => {
    try {
        var updstatus = { code: "approved", timestamp: Date.now() };
        var updloan = await Loan.findOneAndUpdate({ _id: req.params.id }, { $push: { status: updstatus } });
        res.json({ msg: "loan approved" });
    } catch (error) {
        res.json({ msg: "error in approving loan" });
    }
};

const receiveDownPayment = async (req, res) => {
    try {
        var updstatus = { code: "downpayment Received", timestamp: Date.now() };
        var updloan = await Loan.findOneAndUpdate({ _id: req.params.id }, { $push: { status: updstatus } });
        res.json({ msg: "downpayment Received" });
    } catch (error) {
        res.json({ msg: "error in updating downpayment details" });
    }
};

const disburseLoan = async (req, res) => {
    try {
        var updstatus = { code: "disbursed", timestamp: Date.now() };
        var updloan = await Loan.findOneAndUpdate({ _id: req.params.id }, { $push: { status: updstatus } }, { new: true });
        if (!updloan) {
            return res.json({ msg: "Loan not found" });
        }
        // console.log("updloan",updloan)

        var netLoanAmount = +(updloan.productcost) - (updloan.downpayment);
        var emiAmount = Math.ceil(
            netLoanAmount * ((updloan.intrest.rateofintrest) / 12 / 100) / (1 - (Math.pow(1 + (updloan.intrest.rateofintrest / 12 / 100), -updloan.intrest.tenure)))
        );
        var Interest = Math.ceil((netLoanAmount * updloan.intrest.rateofintrest) / 12 / 100);
        var Principal = Math.ceil(emiAmount - Interest);
        
        // console.log("netLoanAmount", netLoanAmount);
        // console.log("Intrestrate", Interest);
        // console.log("Principal", Principal);
        // console.log("emiAmount", emiAmount);

        var emiSchedule = [];
        for (let i = 1; i <= updloan.intrest.tenure; i++) {
            emiSchedule.push({
                emiAmount,
                emiDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
                emiStatus: "not paid",
                Principal,
                Interest,
            });
        }
        await Loan.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { emis: { $each: emiSchedule } } }
        );

        // Send SMS notification to customer
        // try {
            
        //     const toNumber = `+91${updloan.customerMobile}`;
        //      const message = `Dear ${updloan.customerName}, your loan for ${updloan.loanitem} of amount ${netLoanAmount} has been sanctioned. Your EMI is ${emiAmount} for ${updloan.intrest.tenure} months.`;
        //      await twilio.messages.create({
        //         body: message,
        //         from: TWILIO_PHONE,
        //         to: toNumber
        //     }); 
            
        //     console.log(`SMS sent successfully to ${toNumber}`);
           


        // } catch (smsError) {
        //     // If SMS fails, just log the error. Don't stop the function.
        //     console.error("Failed to send SMS:", smsError.message);
        //     res.json({ msg: "loan disbursed but failed to send SMS" });
        // }

    


console.log(`+91${updloan.customerMobile}`, 'mmmmmm');
const response = await axios.post(
  `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
  {
    recipients: [ `+91${updloan.customerMobile}` ],
    message: `Dear ${updloan.customerName}, your loan for ${updloan.loanitem} of amount has been sanctioned .`
  },
  { headers: { 'x-api-key': API_KEY } }
)

    console.log(response.data,'kkkkk')

      


        res.statu(200).json({ msg: "loan disbursed" , });
    } catch (error) {
        res.json({ msg: "error in disbursing loan" });
    }
};


module.exports = {
    getAllLoans,
    getLoanDetails,
    getUserLoanDetails,
    payEmi,
    addLoan,
    approveLoan,
    receiveDownPayment,
    disburseLoan
};