from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.dialects.postgresql import ARRAY

db = SQLAlchemy()
bcrypt = Bcrypt()


def connect_db(app):
    db.app = app
    db.init_app(app)

# MODELS GO BELOW!

class User(db.Model):
    """User in the system."""

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    email = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )


    password = db.Column(
        db.Text,
        nullable=False,
    )
    @classmethod
    def signup(cls, username, email, password):
        """Sign up user.

        Hashes password and adds user to system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            email=email,
            password=hashed_pwd,
        )

        db.session.add(user)
        return user
    @classmethod
    def change_password(cls, user, password):
        """Sign up user.

        Hashes password and adds user to system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user.password = hashed_pwd
        db.session.add(user)
        db.session.commit()
        return user


    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.

        This is a class method (call it on the class, not an individual user.)
        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If can't find matching user (or if password is wrong), returns False.
        """

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False

class SavedBooks(db.Model):
    """Table of saved books for the user"""
        
    __tablename__ = 'saved_books'
        
    id = db.Column(db.String, primary_key=True, default = "The ID of this book is not available")
    isbn13 = db.Column(db.String, index=True, default = "N/A")
    title = db.Column(db.String, index=True, default = "The title of this book is not available")
    rating = db.Column(db.String, default="N/A")
    info = db.Column(db.String, default="N/A")
    authors = db.Column((ARRAY(db.String)), default = "N/A")
    description = db.Column(db.String, default = "A description of this book is not available")
    thumbnail = db.Column(db.String, default = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)



    # def __repr__(self):
    #     return f"id = {self.id}, flavor = {self.flavor}, size = {self.size}, rating = {self.rating}, image = {self.image}"

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "isbn13": self.isbn13,
            "rating": self.rating,
            "thumbnail": self.thumbnail,
            "description": self.description,
            "info": self.info,
            "authors":self.authors
        }