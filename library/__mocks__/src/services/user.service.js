"use strict";
const UserService = jest.createMockFromModule("../../../src/services/user.service");

UserService.DEFAULT_ROLE = "follower";
UserService.userExists = jest.fn();
UserService.toResource = jest.fn();

module.exports = UserService;
