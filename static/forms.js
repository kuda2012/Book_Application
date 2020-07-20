const editUsernameInput = document.getElementById("username");
const newPasswordInput = document.getElementById("new_password");
const newPasswordInputMatch = document.getElementById("new_password_match");
const BASE_URL_USERNAMES = "http://127.0.0.1:5000/usernames/all";
const BASE_URL_EMAILS = "http://127.0.0.1:5000/emails/all";
const submitButton = document.getElementById("submitButton");

if (editUsernameInput) {
  const forms = Array.from(document.querySelectorAll(".form-group"));
  const usernameAvailability = document.createElement("div");
  usernameAvailability.setAttribute("id", "usernameAvailability");
  forms[0].append(usernameAvailability);
  editUsernameInput.addEventListener("input", async function () {
    resp = await axios.get(BASE_URL_USERNAMES, {
      params: { username: editUsernameInput.value },
    });
    usernameAvailability.innerText = resp.data;
    if (resp.data != "Username is available") {
      submitButton.disabled = true;
    } else {
      submitButton.disabled = false;
    }
    console.log(resp);
  });
  const emailInput = document.getElementById("email");
  if (email) {
    const formError = document.getElementById("formError");
    const emailAvailability = document.createElement("div");
    emailAvailability.setAttribute("id", "emailAvailability");
    forms[1].append(emailAvailability);
    emailInput.addEventListener("input", async function () {
      if (formError) {
        formError.innerText = "";
      }

      resp = await axios.get(BASE_URL_EMAILS, {
        params: { email: emailInput.value },
      });
      emailAvailability.innerText = resp.data;
      if (resp.data != "Email is available") {
        submitButton.disabled = true;
      } else {
        submitButton.disabled = false;
      }
      console.log(resp);
    });
  }
}

if (newPasswordInput) {
  const forms = Array.from(document.querySelectorAll(".form-group"));

  const passwordMatchCheck = document.createElement("div");
  passwordMatchCheck.setAttribute("id", "passwordMatch");
  forms[2].append(passwordMatchCheck);

  newPasswordInputMatch.addEventListener("input", function () {
    if (newPasswordInput.value != newPasswordInputMatch.value) {
      passwordMatchCheck.innerText = "Passwords do not match";
      submitButton.disabled = true;
    } else {
      passwordMatchCheck.innerText = "Passwords are a match";
      submitButton.disabled = false;
    }
  });
}
