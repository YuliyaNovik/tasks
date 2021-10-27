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

const sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return reject(error);
            }
            console.log("Email sent: " + info.response);
            resolve();
        });
    });
};

const sendLinkToReset = async ({ email, firstName, lastName }, link) => {
    const mailOptions = {
        from: mailCredentials.user,
        to: email,
        subject: "Library API Reset Password",
        html: `<h1>Welcome, ${firstName} ${lastName}</h1><p>Please set a new password <a href="${link}">here</a>.</p>`,
    };
    await sendMail(mailOptions);
};

const sendSuccessfulReset = async ({ email }, link) => {
    const mailOptions = {
        from: mailCredentials.user,
        to: email,
        subject: "Library API Successful Reset",
        html: `<h1>Your password was successfully changed</h1><p>If you did not make this change or believe an unauthorized person has accessed your account, please reset your password immediately <a href="${link}">here</a>.</p>`,
    };
    await sendMail(mailOptions);
};

module.exports = { sendMail, sendLinkToReset, sendSuccessfulReset };
