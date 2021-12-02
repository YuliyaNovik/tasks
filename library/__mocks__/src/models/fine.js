"use strict";
const fine = jest.createMockFromModule("../../../src/models/author");

fine.create = jest.fn();
fine.getById = jest.fn();
fine.getAll = jest.fn();
fine.deleteById = jest.fn();

module.exports = fine;