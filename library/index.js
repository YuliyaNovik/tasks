const Book = require("./models/book");

Book.getAll((error, data) => {
    if (error) {
        console.log(error);
    } else {
        console.log(data);
    }
});
