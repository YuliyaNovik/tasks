const TokenService = jest.createMockFromModule("../../../src/services/author.service");

TokenService.getActiveToken = jest.fn();
TokenService.deleteByTokenValue = jest.fn();
TokenService.isValidToken = jest.fn();

module.exports = TokenService;
