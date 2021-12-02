"use strict";
const userFine = jest.createMockFromModule("../../../src/models/userFine");

userFine.create = jest.fn();
userFine.deleteByUserIdAndFineId = jest.fn();
userFine.deleteById = jest.fn();
userFine.getByUserIdAndFineId = jest.fn();
userFine.getAllByUserId = jest.fn();
userFine.getById = jest.fn();
userFine.getAll = jest.fn();
userFine.getAllByFineId = jest.fn();

module.exports = userFine;
