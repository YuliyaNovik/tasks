const nodemailer = require("nodemailer");

const mailCredentials = {
    service: process.env.MAIL_SERVICE,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
};

const createTransport = ({ service, user, pass }) => {
    return nodemailer.createTransport({
        service,
        auth: {
            user,
            pass,
        },
    });
};

const transporter = createTransport(mailCredentials);

const send = (mail) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(Object.assign({ from: mailCredentials.user }, mail.options), function (error, info) {
            if (error) {
                console.log(error);
                return reject(error);
            }
            console.log("Email sent: " + info.response);
            resolve();
        });
    });
};

module.exports = { send };
