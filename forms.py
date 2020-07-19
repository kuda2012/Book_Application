from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, BooleanField, IntegerField, RadioField, SelectField
from wtforms.validators import InputRequired, Optional, AnyOf, URL, Email, NumberRange
import email_validator


categories = [("","---"),"Antiques", "Art", "Architecture", "Bibles", "Biography", "Body, Mind & Spirit", "Business & Economics",
              "Comics & Graphic Novels", "Computers", "Cooking", "Crafts & Hobbies", "Design", "Education", "Family & Relationships",
              "Fiction", "Foreign Language Study", "Games & Activites", "Gardening", "Health & Fitness", "History", "House & Home",
              "Humor", "Juvenile Fiction", "Juvenile Nonfiction", "Language Arts & Disciplines", "Law"
              "Literary Collections", "Literary Criticism", "Mathematics", "Medical", "Music", "Nature", "Performing Arts", "Pets", "Philosophy",
              "Photography", "Political Science", "Psychology", "Reference", "Religion", "Science", 'Self-Help', "Social Science", 'Sports & Recreation', "Study Aids", 'Technology & Engineering', "Transportation", "Travel", "True Crime", "Young Adult Fiction", "Young Adult Nonfiction"]

previews = [("","---"),("partial","Partial Preview"), ("full", "Full Text Available"), ("free-ebooks", "Free E-books"), ("paid-ebooks", "Paid E-books"), ("ebooks", "E-books(paid or free)")]
orderBy = [("","---"),("newest","Newest"), ("relevance", "Relevance")]

class BookConditionsForm(FlaskForm):

    general_search = StringField(
        "Enter Title, Author, or ISBN", validators=[InputRequired()])
    order_by_filter = SelectField("Order By", choices=[order for order in orderBy])
    preview_filter = SelectField("Preview availablity", choices = [preview for preview in previews])
    categories_filter = SelectField("Filter By Category", validators=[Optional()], choices=[
                             (category, category) if type(category)!= tuple else category for category in categories])
