var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51KeJ0kJ2m5v52NCmZcWcu1iowjnBMaBnuKlOKdxZEyAnUa1rqCwHKKTQeW7JLYSWuQ5WJpQQMOgnP5pBRXmpb4aB00U6Jnen2t');


router.post('/create-checkout-session', async (req, res) => {
 


    const { subs, token } = req.body.body

    return stripe.customers.create({
        email: token.email,
        source:  token.id
    }).then(customer => {
        stripe.charges.create({
            amount:subs.price*100,
            currency:'usd',
            customer:customer.id,
            receipt_email:token.email,
            description:subs.name
        })
    
    })
        .then(result => res.status(200).json(result))
        .catch(err=>console.log(err))
})

module.exports = router;
