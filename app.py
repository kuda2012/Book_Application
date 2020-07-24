from flask import Flask, render_template, request, jsonify, session, g, redirect, flash, json
import requests
from forms import BookConditionsForm, UserForm, LoginForm, EditUsernameForm, EditUserPasswordForm, DeleteUserForm, SearchSavedBooks
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from secrets import SECRET_KEY
from models import db, User, connect_db, SavedBooks
import os
import re
# import wtforms_json


app = Flask(__name__)
# wtforms_json.init()
CURR_USER_KEY = "curr_user"
# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgres:///book_db'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")

toolbar = DebugToolbarExtension(app)

connect_db(app)

db.create_all()


BASE_URL = "https://www.googleapis.com/books/v1/volumes?"
BASE_URL_VOLUME_SEARCH = "https://www.googleapis.com/books/v1/volumes"


@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None


def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id


def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@app.route('/')
def homepage():
    """Show homepage."""

    form = BookConditionsForm()
    if not g.user:
        return render_template("home_userless.html", form=form)
    else:
        return render_template("home_logged_in.html", form=form, user=g.user)


@app.route('/signup', methods=["GET", "POST"])
def signup():
    """Handle user signup.

    Create new user and add to DB. Redirect to home page.

    If form not valid, present form.

    If the there already is a user with that username: flash message
    and re-present form.
    """

    form = UserForm()
    if g.user:
        return redirect(f"/")

    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data,
            )
            db.session.commit()

        except IntegrityError:
            flash("Username or Email already taken", 'danger')
            return render_template('signup.html', form=form)

        do_login(user)
        flash(f"Welcome, {user.username}!", "success")
        return redirect("/")

    else:
        print(form.errors)
        return render_template('signup.html', form=form)


@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""
    if g.user:
        return redirect(f"/")
    form = LoginForm()
    if form.validate_on_submit():
        user = User.authenticate(form.username.data,
                                 form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.username}!", "success")
            return redirect("/")

        flash("Invalid credentials.", 'danger')
        return render_template('login.html', form=form)
    else:
        return render_template('login.html', form=form)


@app.route('/logout')
def logout():
    """Handle logout of user."""

    if g.user:
        user = User.query.get(session[CURR_USER_KEY])
        flash(f"See you later, {user.username}", "success")
        do_logout()
        return redirect("/")
    else:
        return redirect("/")


# User Info Routes

@app.route("/users/<user_id>")
def show_user(user_id):
    """Show user profile"""

    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")
    else:
        return render_template("user/show_user.html", user=g.user)


@app.route("/usernames/all")
def check_username_availability():
    """Check if username is available"""

    usernames = [username[0]
                 for username in db.session.query(User.username).all()]

    if g.user:
        if request.args["username"] == g.user.username:
            return "This is your current username"
    if request.args["username"] in usernames:
        return "Username is already taken"
    elif len(request.args["username"]) < 5:
        return "Username is too short (must be at least 5 characters)"
    elif len(request.args["username"]) > 50:
        return "Username is too long (maximum length = 50 characters)"
    else:
        return "Username is available"


@app.route("/emails/all")
def check_emails_availability():
    """Check if email is available"""
    regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
    # for custom mails use: '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'

    # Define a function for
    # for validating an Email
    def check(email):

        # pass the regular expression
        # and the string in search() method
        if(re.search(regex, email)):
            return True

        else:
            return False

    emails = [email[0] for email in db.session.query(User.email).all()]

    if request.args["email"] in emails:
        return "Email is already taken"
    elif len(request.args["email"]) > 50:
        return "Email is too long (maximum length = 50 characters)"
    elif check(request.args["email"]):
        return "Email is available"
    else:
        return "Email is not a valid email address"


@app.route("/users/<user_id>/edit")
def edit_user(user_id):
    """Show user options to edit their profile"""

    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")

    return render_template('user/edit_user.html', user=g.user)


@app.route("/users/<user_id>/edit/username", methods=["GET", "POST"])
def edit_username(user_id):
    """Edit Username """

    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")

    form = EditUsernameForm()

    if form.validate_on_submit():
        user = User.authenticate(g.user.username,
                                 form.password.data)

        if user:
            if user.username == form.username.data:
                flash("Current Username entered, Username not changed", "danger")
                return redirect(f"users/{user_id}")
            user.username = form.username.data
            db.session.add(user)
            try:
                db.session.commit()
            except IntegrityError:
                flash("Username Already Taken", "danger")
                return redirect(f"/users/{user_id}/edit/username")
            flash(f"Username changed to {user.username}", "success")
            return redirect(f"users/{user_id}")
        flash("Invalid Current Password", 'danger')
    return render_template('user/edit_username.html', user=g.user, form=form)


@app.route("/users/<user_id>/edit/password", methods=["GET", "POST"])
def edit_password(user_id):
    """Edit Password """

    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")

    form = EditUserPasswordForm()
    if form.validate_on_submit():
        user = User.authenticate(g.user.username,
                                 form.password.data)

        if user:

            if form.new_password.data != form.new_password_match.data:
                flash("New Password inputs did not match, try again", "danger")
                return redirect(f"users/{user_id}/edit/password")
            elif form.new_password.data == form.password.data:
                flash("Current Password entered, Password not changed", "danger")
                return redirect("/")
            else:
                user = User.change_password(user, form.new_password.data)
                flash("Password Changed", "success")
                return redirect("/")
        else:
            flash("Invalid Current Password", "danger")
            return redirect(f"users/{user_id}/edit/password")

    return render_template("user/edit_password.html", form=form, user=g.user)


@app.route("/users/<user_id>/delete_user", methods=["GET", "POST"])
def delete_user(user_id):
    """Permanently delete ccount"""
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")

    form = DeleteUserForm()

    if form.validate_on_submit():
        user = User.authenticate(g.user.username,
                                 form.delete_user.data)
        if user:
            db.session.delete(user)
            username = user.username
            db.session.commit()
            flash(
                f"Farewell, {username}. You're always welcome to come back", "primary")
            return redirect("/")
        flash("Invalid Password", "danger")
        return redirect(f"users/{user_id}/delete_user")
    return render_template("user/delete_user.html", form=form, user=g.user)

# Saved Books Routes

@app.route("/API/users/<user_id>/books", methods=["GET"])
def show_books_api(user_id):
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")

    saved_books = SavedBooks.query.filter_by(user_id=g.user.id).all()
    books_array = []
    for book in saved_books:
        # print(type(book))
        books_array.append(book.serialize())
        # print(books_array)

    
    return jsonify(books_array)



@app.route("/users/<user_id>/books", methods=["GET"])
def show_books(user_id):
    """Add book to saved books"""
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")
    form = SearchSavedBooks()
    # saved_books = SavedBooks.query.all()
    return render_template("show_books.html", form = form, user = g.user)






@app.route("/users/<user_id>/books/add", methods=["POST"])
def add_books(user_id):
    """Add book to saved books"""
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")
    # print(request.json["bookID"])
    # print(f'{BASE_URL_VOLUME_SEARCH}/{request.json["bookID"]}')
    user_book = SavedBooks.query.filter_by(id=request.json["id"]).one_or_none()
    print(user_book)
    if user_book:
        return "You've already saved this book"
    resp = requests.get(
        f'{BASE_URL_VOLUME_SEARCH}/{request.json["id"]}')
    response = resp.json()
    isbn13 = None
    thumbnail = None
    description = None
    rating = None
    info = None
    authors = None

    try:
        isbn13 = response["volumeInfo"]["industryIdentifiers"][1]["identifier"]
    except KeyError:
        isbn13 = None
    try:
        thumbnail = response["volumeInfo"]["imageLinks"]["smallThumbnail"]
    except KeyError:
        thumbnail = None
    try:
        description = response["volumeInfo"]["description"]
    except KeyError:
        description = None
    try:
        title = response["volumeInfo"]["title"]
    except KeyError:
        title = None
    try:
        rating = response["volumeInfo"]["averageRating"]
    except KeyError:
        rating = None
    try:
        info = response["volumeInfo"]["infoLink"]
    except KeyError:
        info = none
    try:
        authors = response["volumeInfo"]["authors"]
        print(authors)
        # print(authors)
        # authors = authors.strip("")
        # authors = authors.join("")
    except KeyError:
        authors = None
    saved_book = SavedBooks(id=response["id"], isbn13=isbn13,rating = rating, info = info, authors = authors,
                            title=title, description=description, thumbnail=thumbnail, user_id=g.user.id)

    db.session.add(saved_book)
    db.session.commit()
    print(saved_book)
    return jsonify(response)


@app.route("/users/<user_id>/books/delete", methods=["POST"])
def delete_book(user_id):
    """Add book to saved books"""
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")
    # print(request.json["bookID"])
    # print(f'{BASE_URL_VOLUME_SEARCH}/{request.json["bookID"]}')
    user_book = SavedBooks.query.filter_by(id=request.json["id"]).one_or_none()
    print(user_book)
    if user_book:
        db.session.delete(user_book)
        db.session.commit()
        return jsonify("Book has been deleted")
    else:
        return "Book has already been deleted"