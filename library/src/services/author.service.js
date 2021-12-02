const Author = require("../models/author");

// TODO: remove logic and use db request with filtering
const exists = async (filter) => {
    try {
        const allAuthors = await Author.getByFilter(filter);
        return (
            allAuthors.filter((author) => {
                return !(
                    (filter.name && filter.name !== author.name) ||
                    (filter.country && filter.country !== author.country) ||
                    (filter.languageId && filter.languageId !== author.languageId)
                );
            }).length > 0
        );
    } catch (e) {
        return false;
    }
};

module.exports = { exists };
