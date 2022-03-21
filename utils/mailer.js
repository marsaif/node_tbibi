var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.sendVerifyMail = ((to,verificationToken) => {

    const url = `http://localhost:3006/verify/${verificationToken}`

    var mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to ,
        subject: 'Sending Email using Node.js',
        text: url
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
})