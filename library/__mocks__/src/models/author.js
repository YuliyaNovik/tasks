"use strict";
const author = jest.createMockFromModule("../../../src/models/author");

author.create = jest.fn();
author.getById = jest.fn();
author.getAll = jest.fn();
author.deleteById = jest.fn();

module.exports = author;
