from flask import Flask, render_template, request, jsonify, session, g, redirect, flash, json
import requests
from werkzeug.datastructures import MultiDict
from forms import BookConditionsForm, UserForm, LoginForm, EditUsernameForm, EditUserPasswordForm, DeleteUserForm, SearchSavedBooks, UserEmailForm
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from models import db, User, connect_db, SavedBooks
import os
import re
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import wtforms_json


app = Flask(__name__)
wtforms_json.init()
CURR_USER_KEY = "curr_user"
# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', "postgres://postgres@127.0.0.1:5432/book_db"))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "secret")

toolbar = DebugToolbarExtension(app)

connect_db(app)


db.create_all()


BASE_URL = "https://www.googleapis.com/books/v1/volumes?"
BASE_URL_VOLUME_SEARCH = "https://www.googleapis.com/books/v1/volumes"



limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 per day", " 200 per hour"]
)



@app.before_request
@limiter.exempt
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
@limiter.exempt
def homepage():
    """Show homepage."""

    form = BookConditionsForm()
    if not g.user:
        return render_template("home_userless.html", form=form)
    else:
        return render_template("home_logged_in.html", form=form, user=g.user)


@app.route('/signup', methods=["GET", "POST"])
@limiter.exempt
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
            if (form.password.data != form.new_password_match.data):
                flash("Passwords did not match", 'danger')
                return render_template('signup.html', form=form)
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
        return render_template('signup.html', form=form)


@app.route('/login', methods=["GET", "POST"])
@limiter.exempt
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

        flash("The username and password you entered did not match our records. Please double-check and try again.", 'danger')
        return render_template('login.html', form=form)
    else:
        return render_template('login.html', form=form)


@app.route('/logout')
@limiter.exempt
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
@limiter.exempt
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
    emails = [email[0] for email in db.session.query(User.email).all()]
    data = MultiDict(mapping=request.args)
    form = UserEmailForm(data, csrf_enabled=False)
    if form.validate() and form.email.data not in emails:
        return "Email Address is valid and available"
    else:
        if form.email.data in emails:
            return "Email Address is already taken"
        else:
            return "Email Address is not valid"



@app.route("/users/<user_id>/edit")
@limiter.exempt
def edit_user(user_id):
    """Show user options to edit their profile"""

    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")

    return render_template('user/edit_user.html', user=g.user)


@app.route("/users/<user_id>/edit/username", methods=["GET", "POST"])
@limiter.exempt
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
@limiter.exempt
def edit_password(user_id):
    """Edit Password """

    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")

    form = EditUserPasswordForm()
    if form.validate_on_submit():
        if (form.new_password.data != form.new_password_match.data):
            flash("Passwords did not match", 'danger')
            return render_template('user/edit_password.html', form=form, user=g.user)
        user = User.authenticate(g.user.username,
                                 form.password.data)

        if user:

            if form.new_password.data != form.new_password_match.data:
                flash("New Password inputs did not match, try again", "danger")
                return redirect(f"users/{user_id}/edit/password")
            else:
                user = User.change_password(user, form.new_password.data)
                flash("Password Changed", "success")
                return redirect("/")
        else:
            flash("Invalid Current Password", "danger")
            return redirect(f"users/{user_id}/edit/password")

    return render_template("user/edit_password.html", form=form, user=g.user)


@app.route("/users/<user_id>/delete_user", methods=["GET", "POST"])
@limiter.exempt
def delete_user(user_id):
    """Permanently delete cacount"""
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
                f"Farewell, {username}. You're always welcome to come back", "success")
            return redirect("/")
        flash("Invalid Current Password", "danger")
        return redirect(f"users/{user_id}/delete_user")
    return render_template("user/delete_user.html", form=form, user=g.user)

# Saved Books Routes


@app.route("/API/users/<user_id>/books", methods=["GET"])
@limiter.exempt
def show_books_api(user_id):
    """Return all saved books"""
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")

    saved_books = SavedBooks.query.filter_by(user_id=g.user.id).all()
    books_array = []
    for book in saved_books:
        books_array.append(book.serialize())
    return jsonify(books_array)


@app.route("/users/<user_id>/books/filter", methods=["GET"])
@limiter.exempt
def filter_books(user_id):
    """Filter saved books"""
    from sqlalchemy import or_, func as F, any_
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")
    query = request.args.get("query")
    books_array = []
    search_books = SavedBooks.query.filter(or_(SavedBooks.title.ilike(f'%{query}%'), SavedBooks.isbn13.ilike(
        f'%{query}%'), SavedBooks.authors_string.ilike((f'%{query}%')))).all()

    for book in search_books:
        books_array.append(book.serialize())

    return jsonify(books_array)



@app.route("/users/<user_id>/books", methods=["GET"])
@limiter.exempt
def show_books(user_id):
    """Send HTML frame for all saved books"""
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")
    form = SearchSavedBooks()
    saved_books = SavedBooks.query.filter_by(user_id=g.user.id).all()
    if (len(saved_books) == 0):
        flash("You don't have any books saved yet, search for a book so you can save it", "danger")
        return redirect("/")
    return render_template("show_books.html", form=form, user=g.user)


@app.route("/users/<user_id>/books/add", methods=["POST"])
@limiter.exempt
def add_books(user_id):
    """Add book to saved books"""
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")
    user_book = SavedBooks.query.filter_by(id=request.json["id"]).one_or_none()
    if user_book:
        return "You've already saved this book"
    resp = requests.get(
        f'{BASE_URL}', params={'q': request.json["id"]})
    response = resp.json()
    isbn13 = None
    thumbnail = None
    description = None
    rating = None
    info = None
    authors = None
    authors_string = None
    try:
        try:
            isbn13 = response['items'][0]["volumeInfo"]["industryIdentifiers"][1]["identifier"]
        except (IndexError, KeyError):
            isbn13 = None
        try:
            thumbnail = response['items'][0]["volumeInfo"]["imageLinks"]["smallThumbnail"]
        except (IndexError, KeyError):
            thumbnail = None
        try:
            description = response['items'][0]["volumeInfo"]['description']
        except (IndexError, KeyError):
            description = None
        try:
            title = response['items'][0]["volumeInfo"]["title"]
        except (IndexError, KeyError):
            title = None
        try:
            rating = response['items'][0]["volumeInfo"]["averageRating"]
        except (IndexError, KeyError):
            rating = None
        try:
            info = response['items'][0]["volumeInfo"]["infoLink"]
        except (IndexError, KeyError):
            info = None
        try:
            authors = response['items'][0]["volumeInfo"]["authors"]
        except (IndexError, KeyError):
            authors = None
        try:
            if(authors != None):
                authors_string = str(authors).strip('[]')
            else:
                authors = None
        except:
            authors_string = None
        saved_book = SavedBooks(id=response["items"][0]['id'], isbn13=isbn13, rating=rating, info=info, authors=authors, authors_string=authors_string,
                                title=title, description=description, thumbnail=thumbnail, user_id=g.user.id)

        db.session.add(saved_book)
        db.session.commit()

        return jsonify(response)
    except (IndexError, KeyError):

        resp = requests.get(
            f'{BASE_URL_VOLUME_SEARCH}/{request.json["id"]}')
        response = resp.json()
        try:
            isbn13 = response["volumeInfo"]["industryIdentifiers"][1]["identifier"]
        except (IndexError, KeyError):
            isbn13 = None
        try:
            thumbnail = response["volumeInfo"]["imageLinks"]["smallThumbnail"]
        except (IndexError, KeyError):
            thumbnail = None
        try:
            description = response["volumeInfo"]['description']
        except (IndexError, KeyError):
            description = None
        try:
            title = response["volumeInfo"]["title"]
        except (IndexError, KeyError):
            title = None
        try:
            rating = response["volumeInfo"]["averageRating"]
        except (IndexError, KeyError):
            rating = None
        try:
            info = response["volumeInfo"]["infoLink"]
        except (IndexError, KeyError):
            info = None
        try:
            authors = response["volumeInfo"]["authors"]
        except (IndexError, KeyError):
            authors = None
        saved_book = SavedBooks(id=request.json["id"], isbn13=isbn13, rating=rating, info=info, authors=authors, authors_string=authors,
                                title=title, description=description, thumbnail=thumbnail, user_id=g.user.id)

        db.session.add(saved_book)
        db.session.commit()
        return jsonify(response)


@app.route("/users/<user_id>/books/delete", methods=["POST"])
@limiter.exempt
def delete_book(user_id):
    """Delete book from saved books"""
    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")
    user_book = SavedBooks.query.filter_by(id=request.json["id"]).one_or_none()
    if user_book:
        db.session.delete(user_book)
        db.session.commit()
        return jsonify("Book has been deleted")
    else:
        return "Book has already been deleted"
