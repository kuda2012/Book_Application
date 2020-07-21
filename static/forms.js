const editUsernameInput = document.getElementById("username");
const newPasswordInput = document.getElementById("new_password");
const passwordInput = document.getElementById("password");
const passwordInputMatch = document.getElementById("new_password_match");
const deleteUser = document.getElementById("delete_user");
const BASE_URL_USERNAMES = "http://127.0.0.1:5000/usernames/all";
const BASE_URL_EMAILS = "http://127.0.0.1:5000/emails/all";
const submitButton = document.getElementById("submitButton");
const formErrors = Array.from(document.querySelectorAll(".formError"));
submitButton.disabled = true;

// Register Page Logic
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
    } else if (
      resp.data == "Username is available" &&
      document.getElementById("editUsernameTitle")
    ) {
      submitButton.disabled = false;
    }
    console.log(resp);
    if (formErrors) {
      for (let err of formErrors) {
        err.innerText = "";
      }
    }
  });
  const emailInput = document.getElementById("email");
  if (emailInput) {
    const emailAvailability = document.createElement("div");
    emailAvailability.setAttribute("id", "emailAvailability");
    forms[1].append(emailAvailability);
    emailInput.addEventListener("input", async function () {
      resp = await axios.get(BASE_URL_EMAILS, {
        params: { email: emailInput.value },
      });
      emailAvailability.innerText = resp.data;
      console.log(resp);

      if (formErrors) {
        for (let err of formErrors) {
          err.innerText = "";
        }
      }
    });
  }
  if (passwordInputMatch) {
    const passwordMatchCheck = document.createElement("div");
    passwordMatchCheck.setAttribute("id", "passwordMatch");

    forms[3].append(passwordMatchCheck);

    passwordInputMatch.addEventListener("input", function () {
      if (passwordInput.value == passwordInputMatch.value) {
        passwordMatchCheck.innerText = "Passwords are a match";
        submitButton.disabled = false;
      }
      if (formErrors) {
        for (let err of formErrors) {
          err.innerText = "";
        }
      }
    });
  }
}
// Delete User Logic
if (deleteUser) {
  submitButton.disabled = false;
  if (formErrors) {
    for (let err of formErrors) {
      err.innerText = "";
    }
  }
}

// Edit Password Logic
if (newPasswordInput) {
  const forms = Array.from(document.querySelectorAll(".form-group"));

  const passwordMatchCheck = document.createElement("div");
  passwordMatchCheck.setAttribute("id", "passwordMatch");
  forms[2].append(passwordMatchCheck);

  passwordInputMatch.addEventListener("input", function () {
    if (newPasswordInput.value != passwordInputMatch.value) {
      passwordMatchCheck.innerText = "Passwords do not match";
    } else {
      passwordMatchCheck.innerText = "Passwords are a match";
      submitButton.disabled = false;
    }
    if (formErrors) {
      for (let err of formErrors) {
        err.innerText = "";
      }
    }
  });
}
