"use strict";
const user = jest.createMockFromModule("../../../src/models/user");

user.create = jest.fn();
user.getById = jest.fn();
user.getAll = jest.fn();
user.deleteById = jest.fn();
user.getByEmail = jest.fn();
user.update = jest.fn();

module.exports = user;

