const editUsernameInput = document.getElementById("username");
const newPasswordInput = document.getElementById("new_password");
const passwordInput = document.getElementById("password");
const passwordInputMatch = document.getElementById("new_password_match");
const deleteUserInput = document.getElementById("delete_user");
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
    if (!document.getElementById("loginTitle")) {
      usernameAvailability.innerText = resp.data;
    }

    if (
      resp.data != "Username is available" &&
      document.getElementById("editUsernameTitle")
    ) {
      submitButton.disabled = true;
    } else if (
      resp.data == "Username is available" &&
      document.getElementById("editUsernameTitle")
    ) {
      submitButton.disabled = false;
    }
    console.log(resp);
    if (editUsernameInput.nextSibling.nextSibling) {
      if (
        editUsernameInput.nextSibling.nextSibling.classList.contains(
          "formError"
        )
      ) {
        editUsernameInput.nextSibling.nextSibling.innerText = "";
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
      if (emailInput.nextSibling.nextSibling.classList.contains("formError")) {
        console.log(emailInput.nextSibling.nextSibling);
        emailInput.nextSibling.nextSibling.innerText = "";
      }
    });
  }
  if (passwordInputMatch) {
    const passwordMatchCheck = document.createElement("div");
    passwordMatchCheck.setAttribute("id", "passwordMatch");

    forms[3].append(passwordMatchCheck);
    passwordInput.addEventListener("input", function () {
      if (
        passwordInput.value == passwordInputMatch.value &&
        passwordInput.value != ""
      ) {
        passwordMatchCheck.innerText = "Passwords are a match";
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
      if (passwordInput.nextSibling.nextSibling) {
        console.log(passwordInput.nextSibling.nextSibling);
        if (
          passwordInput.nextSibling.nextSibling.classList.contains("formError")
        ) {
          passwordInput.nextSibling.nextSibling.innerText = "";
        }
      }
    });
    passwordInputMatch.addEventListener("input", function () {
      if (
        passwordInput.value == passwordInputMatch.value &&
        passwordInput.value != ""
      ) {
        passwordMatchCheck.innerText = "Passwords are a match";
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }

      if (passwordInputMatch.nextSibling.nextSibling) {
        if (
          passwordInputMatch.nextSibling.nextSibling.classList.contains(
            "formError"
          )
        ) {
          console.log(passwordInputMatch.nextSibling.nextSibling);
          passwordInputMatch.nextSibling.nextSibling.innerText = "";
        }
      }
    });
  }
}

if (passwordInput && !passwordInputMatch) {
  submitButton.disabled = false;
  passwordInput.addEventListener("input", function () {
    if (passwordInput.nextSibling.nextSibling) {
      if (
        passwordInput.nextSibling.nextSibling.classList.contains("formError")
      ) {
        passwordInput.nextSibling.nextSibling.innerText = "";
      }
    }
  });

  // console.log(passwordInput);
  editUsernameInput.addEventListener("input", function () {
    if (editUsernameInput.nextSibling.nextSibling) {
      if (
        editUsernameInput.nextSibling.nextSibling.classList.contains(
          "formError"
        )
      ) {
        editUsernameInput.nextSibling.nextSibling.innerText = "";
      }
    }
  });
}
if (deleteUserInput) {
  // Delete User Logic
  submitButton.disabled = false;
  if (deleteUserInput.nextSibling.nextSibling) {
    if (
      deleteUserInput.nextSibling.nextSibling.classList.contains("formError")
    ) {
      deleteUserInput.nextSibling.nextSibling.innerText = "";
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
    if (
      newPasswordInput.value != passwordInputMatch.value &&
      passwordInput.value != ""
    ) {
      passwordMatchCheck.innerText = "Passwords do not match";
    } else {
      passwordMatchCheck.innerText = "Passwords are a match";
      // submitButton.disabled = false;
    }
    if (newPasswordInput.nextSibling.nextSibling) {
      if (
        newPasswordInput.nextSibling.nextSibling.classList.contains("formError")
      ) {
        newPasswordInput.nextSibling.nextSibling.innerText = "";
      }
    }
  });
}
