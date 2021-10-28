class Letter {
    constructor(to, subject, html) {
        this.options = {
            to,
            subject,
            html,
        };
    }
}

class LinkToResetLetter extends Letter {
    constructor({ email, firstName, lastName }, link) {
        super(
            email,
            "Library API Reset Password",
            `<h1>Welcome, ${firstName} ${lastName}</h1><p>Please set a new password <a href="${link}">here</a>.</p>`
        );
    }
}

class SuccessfulResetLetter extends Letter {
    constructor({ email }, link) {
        super(
            email,
            "Library API Successful Reset",
            `<h1>Your password was successfully changed</h1><p>If you did not make this change or believe an unauthorized person has accessed your account, please reset your password immediately <a href="${link}">here</a>.</p>`
        );
    }
}

module.exports = { LinkToResetLetter, SuccessfulResetLetter };