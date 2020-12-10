DROP DATABASE book_db;
CREATE DATABASE book_db;
\c book_db


DROP TABLE IF EXISTS saved_books;
DROP TABLE IF EXISTS users;




CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);



CREATE TABLE saved_books(
    id TEXT PRIMARY KEY,
    isbn13 INT,
    title TEXT,
    authors TEXT [],
    authors_string TEXT ,
    description TEXT,
    info TEXT,
    rating TEXT,
    thumbnail TEXT,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);


DROP DATABASE book_db_test;
CREATE DATABASE book_db_test;
\c book_db_test


DROP TABLE IF EXISTS saved_books;
DROP TABLE IF EXISTS users;



CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);


CREATE TABLE saved_books(
    id TEXT PRIMARY KEY,
    isbn13 INT,
    title TEXT,
    authors TEXT [],
    authors_string TEXT ,
    description TEXT,
    info TEXT,
    rating TEXT,
    thumbnail TEXT,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);


