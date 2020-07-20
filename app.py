from flask import Flask, render_template, request, jsonify, session, g, redirect, flash, json
import requests
from forms import BookConditionsForm, UserForm, LoginForm, EditUsernameForm, EditUserPasswordForm
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from secrets import SECRET_KEY
from models import db, User, connect_db
import os
# import wtforms_json


app = Flask(__name__)
# wtforms_json.init()
CURR_USER_KEY = "curr_user"
# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgres:///book_db'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")

toolbar = DebugToolbarExtension(app)

connect_db(app)

db.create_all()

BASE_URL = "https://www.googleapis.com/books/v1/volumes?"


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
        return render_template("home_logged_in.html", form=form, user = g.user)



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
        flash(f"Hello, {user.username}!", "success")
        return redirect("/")

    else:
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




# Users#

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
    """Return Yes if username is available"""


    usernames = [username[0] for username in db.session.query(User.username).all()]

    if g.user:
        if request.args["username"] == g.user.username:
             return "This is your current username"
    if request.args["username"] in usernames:
        return "Username is already taken"
    elif len(request.args["username"]) < 4:
        return "Username too short (must be at least 5 characters)"
    elif len(request.args["username"]) > 50:
        return "Username too long (maximum length = 50 characters)"
    else:
        return "Username is available"


@app.route("/users/<user_id>/edit")

def edit_user(user_id):
    """Show user options to edit their profile"""


    if not g.user:
        flash("Must be logged in to access this", 'danger')
        return redirect("/")


    return render_template('user/edit_user.html', user = g.user)
    
@app.route("/users/<user_id>/edit/username", methods = ["GET", "POST"])

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
    return render_template('user/edit_username.html', user = g.user, form = form)
    
@app.route("/users/<user_id>/edit/password", methods = ["GET", "POST"])

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
    
    return render_template("user/edit_password.html", form = form, user = g.user)