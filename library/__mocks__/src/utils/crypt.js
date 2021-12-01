"use strict";
const Crypt = jest.createMockFromModule("../../../src/utils/crypt");

Crypt.encrypt = jest.fn();
Crypt.compare = jest.fn();

module.exports = Crypt;
