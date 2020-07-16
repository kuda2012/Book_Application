from flask import Flask, render_template, request, jsonify
import requests
from forms import BookConditionsForm
from secrets import SECRET_KEY
# import wtforms_json


app = Flask(__name__)
# wtforms_json.init()
app.config['SECRET_KEY'] = SECRET_KEY

BASE_URL = "https://www.googleapis.com/books/v1/volumes?"

print("hi")

@app.route("/")
def homepage():
    """Show homepage."""

    form = BookConditionsForm()
    return render_template("index.html", form = form)
