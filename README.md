![image info](./icon.jpg)

# Book Carousel

Book Carousel is your go-to website for learning more about the books you are curious about.

The site is deployed [here](https://book-carousel.herokuapp.com/).

### Data

##

API Used:

- The [Google Books API](https://developers.google.com/books/docs/v1/using) was used to collect various information such as title, author, and genre for the books that are returned as the search results.

### Features

##

- Ability to search for a book by title, author, or ISBN and request that the results be filtered by release date, genre, or E-book availability
- User can create, edit, or delete their account (account creation not necessary to use app)
- A book-card from the search results shows the User a given book's title, description, author, ISBN13, and rating and has options to purchase or learn more about the book
- User can save a given book to "Saved Books" (Must be logged in)
- In the User's "Saved Books", User can further filter their saved books by searching for a book's author, title, or ISBN. User can also remove a book from their saved books.

### User Flow

##

1. On the homepage, User will see a search bar that allows them to search for a book.
2. Pages of book results will be returned, and user can click on a given book-card and discover more information about the book
3. User can click to save book to their "Saved Books" and then click to be directed to their saved books.
4. There will be links in the menu to allow user to create an account, login/logout, and view their saved books (if logged in)

### Tech Stack

##

- Backend: Python, Flask, Postgres
- Frontend: jQuery

### Database Design

##

An overview of how the database is set up.  
![image info](./database_design.png)
