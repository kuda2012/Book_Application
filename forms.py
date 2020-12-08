from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, BooleanField, IntegerField, RadioField, SelectField, PasswordField
from wtforms.validators import InputRequired, Optional, AnyOf, URL, Email, NumberRange, Length
import email_validator


categories = [("", "---"), "Antiques", "Art", "Architecture", "Bibles", "Biography", "Body, Mind & Spirit", "Business & Economics",
              "Comics & Graphic Novels", "Computers", "Cooking", "Crafts & Hobbies", "Design", "Education", "Family & Relationships",
              "Fiction", "Foreign Language Study", "Games & Activites", "Gardening", "Health & Fitness", "History", "House & Home",
              "Humor", "Juvenile Fiction", "Juvenile Nonfiction", "Language Arts & Disciplines", "Law"
              "Literary Collections", "Literary Criticism", "Mathematics", "Medical", "Music", "Nature", "Performing Arts", "Pets", "Philosophy",
              "Photography", "Political Science", "Psychology", "Reference", "Religion", "Science", 'Self-Help', "Social Science", 'Sports & Recreation', "Study Aids", 'Technology & Engineering', "Transportation", "Travel", "True Crime", "Young Adult Fiction", "Young Adult Nonfiction"]

previews = [("", "---"), ("partial", "Partial Preview"), ("full", "Full Text Available"),
             ("free-ebooks", "Free E-books"), ("paid-ebooks", "Paid E-books"), ("ebooks", "E-books(paid or free)")]
orderBy = [("", "---"), ("newest", "Newest"), ("relevance", "Relevance")]


class BookConditionsForm(FlaskForm):
    general_search = StringField(
        "<b>Enter Title, Author, or ISBN</b>", validators=[InputRequired()])
    order_by_filter = SelectField(
        "Order By", choices=[order for order in orderBy])
    preview_filter = SelectField("Preview availablity", choices=[
                                 preview for preview in previews])
    categories_filter = SelectField("Filter By Category", validators=[Optional()], choices=[
                             (category, category) if type(category) != tuple else category for category in categories])
class SearchSavedBooks(FlaskForm):
        general_search = StringField(
        "Filter your Saved Books: Enter Title, Author, or ISBN", validators=[InputRequired()])

class UserForm(FlaskForm):
    username = StringField("Username", validators=[
                               InputRequired(),Length(min =5, max=50)])
    email = StringField("Email", validators=[Email(), InputRequired()])
    password = PasswordField("Password (Must be between 5 and 50 characters, inclusive)", validators=[InputRequired(), Length(min =5, max=50)])
    new_password_match = PasswordField("Enter Password, again", validators=[InputRequired(), Length(min=5)])

class UserEmailForm(FlaskForm):
    email = StringField("Email", validators=[Email(), InputRequired()])


class LoginForm(FlaskForm):

    username = StringField("Username", validators=[InputRequired(), Length(min =5, max=50)])
    password = PasswordField("Password", validators=[InputRequired(), Length(min =5, max=50)])

class EditUsernameForm(FlaskForm):
    
    username = StringField("Desired New Username", validators=[InputRequired(), Length(min =5, max=50)])
    password = PasswordField("Enter Current Password to Confirm", validators=[InputRequired()])

class EditUserPasswordForm(FlaskForm):
    password = PasswordField("Enter Current Password", validators=[InputRequired(),Length(min=5, max = 50)])
    new_password = PasswordField("Enter New Password (Must be between 5 and 50 characters, inclusive) ", validators=[InputRequired(), Length(min=5, max = 50)])
    new_password_match = PasswordField("Enter New Password, again", validators=[InputRequired(), Length(min=5, max = 50)])


class DeleteUserForm(FlaskForm):
    delete_user = PasswordField("Enter Current Password to Confirm", validators=[InputRequired(), Length(min =5, max=50)])