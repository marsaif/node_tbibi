var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51KeJ0kJ2m5v52NCmZcWcu1iowjnBMaBnuKlOKdxZEyAnUa1rqCwHKKTQeW7JLYSWuQ5WJpQQMOgnP5pBRXmpb4aB00U6Jnen2t');
const User = require('../models/user');
var nodemailer = require('nodemailer');
var moment = require('moment');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});



router.post('/create-checkout-session', async (req, res) => {
    console.log("++++++++")
    const { subs, token, meUser } = req.body.body

    var mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: meUser.email,
        subject: 'Payment to Tbibi platform went succesfully ',
        text: "Payment to Tbibi platform went succesfully thank you for your confidence :)"
    };



    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: subs.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: subs.name
        })

    })
        .then(result => {
            User.findByIdAndUpdate(meUser._id, { premium: true }, (err, data) => {
                res.send("data updated");
                console.log(data)
            })


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent:  ' + info.response);
                }
            });

        }).catch(err => console.log(err))
})

router.get("/soldecomptebancaire", function (req, res, next) {
    var lst = []
    stripe.balance.retrieve(function (err, balance) {
        //console.log(balance.available[0]);
        res.json(balance.available[0].amount)

    });

    
     stripe.balanceTransactions.list({ limit: 3 })
        .autoPagingEach(async function (transaction) {

            var time = moment(transaction.created * 1000).format("DD-MM-YYYY");
            lst.push({"key":time})
            transaction.created = moment(transaction.created * 1000).format("DD-MM-YYYY");
            let lastElement = lst[lst.length - 1];

            console.log(lastElement);

        });
   

});


router.get("/premuimstats", function (req, res, next) {
    var array = []
    User.count({ premium: true }, (err, count) => {
        //  console.log(count);
        array.push({ 'nonpremuim': count })
        res.json(count)

    });


});


router.get("/nonpremuimstats", function (req, res, next) {
    var array = []
    User.count({ premium: false }, (err, count) => {
        console.log(count);
        array.push({ 'premuim': count })
        res.json(count)

    });


});

module.exports = router;
