const User = require("../models/user");

const DEFAULT_ROLE = "follower";

const userExists = async (email) => {
    try {
        await User.getByEmail(email);
        return true;
    } catch (e) {
        return false;
    }
};

const toResource = (user) => {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        role: user.role,
    };
};

module.exports = { DEFAULT_ROLE, userExists, toResource };
