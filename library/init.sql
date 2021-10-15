DROP TABLE IF EXISTS book_view, copy_user, book_genre, user, role,
    copy, book, genre, author_name, author, language;

CREATE TABLE IF NOT EXISTS language(id int AUTO_INCREMENT NOT NULL, lang_key VARCHAR(16) NOT NULL, name NVARCHAR(64) NOT NULL, PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS author(id int AUTO_INCREMENT NOT NULL, language_id int NOT NULL, country NVARCHAR(64) NOT NULL, PRIMARY KEY(id), FOREIGN KEY (language_id) REFERENCES language(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS author_name(id int AUTO_INCREMENT NOT NULL, author_id int NOT NULL, language_id int NOT NULL, name NVARCHAR(512) NOT NULL, PRIMARY KEY(id), FOREIGN KEY (author_id) REFERENCES author(id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (language_id) REFERENCES language(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS genre(id int AUTO_INCREMENT NOT NULL, name VARCHAR(64) NOT NULL, PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS book(id int AUTO_INCREMENT NOT NULL, author_id int NOT NULL, name NVARCHAR(1024) NOT NULL, language_id int NOT NULL, annotation NVARCHAR(2048), original_id int, indoor_access TINYINT NOT NULL, PRIMARY KEY(id), FOREIGN KEY (original_id) REFERENCES book(id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (author_id) REFERENCES author(id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (language_id) REFERENCES language(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS copy(id int AUTO_INCREMENT NOT NULL, book_id int NOT NULL, PRIMARY KEY(id), FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS book_genre(id int AUTO_INCREMENT NOT NULL, book_id int NOT NULL, genre_id int NOT NULL, PRIMARY KEY(id), FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS role(id int AUTO_INCREMENT NOT NULL, name VARCHAR(64), PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS user(id int AUTO_INCREMENT NOT NULL, role_id int NOT NULL, first_name NVARCHAR(256), last_name NVARCHAR(256), address NVARCHAR(256), PRIMARY KEY(id), FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS copy_user(id int AUTO_INCREMENT NOT NULL, copy_id int UNIQUE NOT NULL, user_id int NOT NULL, start_time datetime, PRIMARY KEY(id), FOREIGN KEY (copy_id) REFERENCES copy(id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE VIEW book_view AS
  SELECT
    book.id,
    book.name,
    book.annotation,
    an.name as author,
    book.indoor_access,
    book.original_id,
    book.language_id
    FROM book
    INNER JOIN author_name an ON book.author_id = an.author_id
    AND book.language_id = an.language_id;

INSERT INTO librarydb.language (lang_key, name) VALUES ('en', 'English'),
                                                       ('ru', 'Русский'),
                                                       ('be', 'Беларуская');
INSERT INTO librarydb.author (language_id, country) VALUES (1, 'USA');
INSERT INTO librarydb.author_name (language_id, author_id, name) VALUES (1, 1, 'Jack London'),
                                                                        (2, 1, 'Джек Лондон'),
                                                                        (3, 1, 'Джэк Лондан');
INSERT INTO librarydb.book (author_id, name, language_id, annotation, original_id, indoor_access) VALUES (1, 'Martin Eden', 1, 'some text', null, 0);
INSERT INTO librarydb.book (author_id, name, language_id, annotation, original_id, indoor_access) VALUES (1, 'Мартин Иден', 2, 'какой-то текст', 1, 0),
                                                                                                         (1, 'Марцін Ідэн', 3, 'неiкi тэкст', 1, 0);
INSERT INTO librarydb.copy (book_id) VALUES (1), (1), (1), (2), (2), (2), (2), (3);