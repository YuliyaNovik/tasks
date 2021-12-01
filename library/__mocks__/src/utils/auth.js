"use strict";
const Auth = jest.createMockFromModule("../../../src/utils/auth");

Auth.jwt = {
    sign: jest.fn()
};

module.exports = Auth;