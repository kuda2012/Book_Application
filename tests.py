"""Sample test suite for testing demo."""
from flask import session
from unittest import TestCase
from app import app
import json


# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True


# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
# app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False


class HomeViewsTestCase(TestCase):
    """Examples of integration tests: testing Flask app."""

    # @classmethod

    # def setUpClass(cls):
    #     print("Inside Set up Class")
    
    # @classmethod
    # def tearDownClass(cls):
    #     print("Inside Tear Down Class")

    def setUp(self):
        with app.test_client() as client:
            res = client.post("/signup",
            data=({"username": "testuser", "password": "password","new_password_match":"password","email":"testuser@gmail.com"}),
            follow_redirects=True)
            html = res.get_data(as_text=True)
            # print(session)
            # print(html)
    def tearDown(self):
        with app.test_client() as client:
            res2 = client.post("/login",
            data=({"username": "testuser", "password": "password"}),
            follow_redirects=True)
            res = client.post(f'/users/{session["curr_user"]}/delete_user', data={"delete_user": "password", "username": "testuser"}, follow_redirects=True)
            html = res.get_data(as_text=True)
    
    def test_home_page(self):
        "Check response status code and html"
        with app.test_client() as client:
            res = client.get("/")
            html = res.get_data(as_text=True)
            self.assertEqual(res.status_code, 200)
            self.assertIn("Search a book.", html)
            self.assertIn("Enter Title, Author, or ISBN", html)

    
    def test_login(self):
        "Check if session changes with login"
        with app.test_client() as client:
            from forms import LoginForm
            res = client.get("/login")
            raised = False
            try:
                session["curr_user"]
            except:
                raised = True
        # Status:Signed in
            self.assertTrue(raised, "Exception raised")
            # DB comes loaded with testuser
            res2 = client.post("/login",
            data=({"username": "testuser", "password": "password"}),
            follow_redirects=True)
            html2 = res2.get_data(as_text=True)
            self.assertEqual(res2.status_code, 200)
            # self.assertIsInstance(session["curr_user"], int)
            raised = False
            try:
                session["curr_user"]
            except:
                raised = True
            self.assertFalse(raised, "Exception raised")

    def test_signup_and_delete(self):
        "Check if session changes with signup and check if profile is deleted"
        with app.test_client() as client:
            from forms import LoginForm
            res = client.get("/signup")
        # Status:Signed out
            raised = False
            try:
                session["curr_user"]
            except:
                raised = True
        # Status:Signed in
            self.assertTrue(raised, "Exception raised")
            res2 = client.post("/signup",
            data=({"username": "ksjafiuenadsf", "password": "password","new_password_match":"password","email":"ksjafiuenadsf@gmail.com"}),
            follow_redirects=True)
            html2 = res2.get_data(as_text=True)
            self.assertEqual(res2.status_code, 200)
            # self.assertIsInstance(session["curr_user"], int)
            raised = False
            try:
                session["curr_user"]
            except:
                raised = True
        # Status:Signed in
            self.assertFalse(raised, "Exception raised")

        # Deleting user now
            res3 = client.post(f'/users/{session["curr_user"]}/delete_user', data={"delete_user": "password"}, follow_redirects=True)
            html3 = res3.get_data(as_text=True)
        # Status:Signed out
            raised = False
            try:
                session["curr_user"]
            except:
                raised = True
        # Status:Signed in
            self.assertTrue(raised, "Exception raised")
    def test_edit_username(self):
        "Check if session changes with login"
        with app.test_client() as client:
            from forms import LoginForm
            # DB comes loaded with testuser
            res2 = client.post("/login",
            data=({"username": "testuser", "password": "password"}),
            follow_redirects=True)
            html2 = res2.get_data(as_text=True)
            self.assertEqual(res2.status_code, 200)
            raised = False
            try:
                session["curr_user"]
            except:
                raised = True
            self.assertFalse(raised, "Exception raised")
            res3 = client.post(f'/users/{session["curr_user"]}/edit/username',
            data=({"username": "testuser1", "password": "password"}),
            follow_redirects=True)
            html3 = res3.get_data(as_text=True)
            self.assertIn("Username changed to testuser1", html3)
            self.assertEqual(res3.status_code, 200)
            res4 = client.post(f'/users/{session["curr_user"]}/edit/username',
            data=({"username": "testuser", "password": "password"}),
            follow_redirects=True)
            html4 = res4.get_data(as_text=True)
            self.assertEqual(res4.status_code, 200)
            self.assertIn("Username changed to testuser", html4)

    def test_edit_password(self):
        "Check if session changes with login"
        with app.test_client() as client:
            from forms import LoginForm
            # DB comes loaded with testuser
            res2 = client.post("/login",
            data=({"username": "testuser", "password": "password"}),
            follow_redirects=True)
            html2 = res2.get_data(as_text=True)
            self.assertEqual(res2.status_code, 200)
            raised = False
            try:
                session["curr_user"]
            except:
                raised = True
            self.assertFalse(raised, "Exception raised")
            # Changing old password to the same password
            res3 = client.post(f'/users/{session["curr_user"]}/edit/password',
            data=({ "password": "password", "new_password":"password", "new_password_match":"password"}),
            follow_redirects=True)
            html3 = res3.get_data(as_text=True)
            self.assertIn("Password Changed", html3)
            self.assertEqual(res3.status_code, 200)


