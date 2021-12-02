const AuthorService = jest.createMockFromModule("../../../src/services/author.service");

AuthorService.exists = jest.fn();

module.exports = AuthorService;
