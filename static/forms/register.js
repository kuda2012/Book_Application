const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const newPasswordInput = document.getElementById("new_password");
const passwordInput = document.getElementById("password");
const passwordInputMatch = document.getElementById("new_password_match");
const BASE_URL_USERNAMES = "/usernames/all";
const BASE_URL_EMAILS = "/emails/all";
const submitButton = document.getElementById("submitButton");
const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
submitButton.disabled = false;

if (usernameInput) {
  const formGroups = Array.from(document.querySelectorAll(".form-group"));
  const usernameAvailability = document.createElement("div");
  usernameAvailability.setAttribute("id", "usernameAvailability");
  formGroups[0].append(usernameAvailability);
  usernameInput.addEventListener("input", async function () {
    resp = await axios.get(BASE_URL_USERNAMES, {
      params: { username: usernameInput.value },
    });

    usernameAvailability.innerText = resp.data;

    if (usernameInput.nextSibling.nextSibling) {
      if (
        usernameInput.nextSibling.nextSibling.classList.contains("formError")
      ) {
        usernameInput.nextSibling.nextSibling.innerText = "";
      }
    }
  });
}

if (emailInput) {
  const emailAvailability = document.createElement("div");
  emailAvailability.setAttribute("id", "emailAvailability");
  const formGroups = Array.from(document.querySelectorAll(".form-group"));
  formGroups[1].append(emailAvailability);
  emailInput.addEventListener("input", async function () {
    resp = await axios.get(BASE_URL_EMAILS, {
      params: { email: emailInput.value },
    });

    emailAvailability.innerText = resp.data;
    if (emailInput.nextSibling.nextSibling.classList.contains("formError")) {
      emailInput.nextSibling.nextSibling.innerText = "";
    }
  });
}

if (passwordInputMatch) {
  const formGroups = Array.from(document.querySelectorAll(".form-group"));
  const passwordLengthCheck = document.createElement("div");
  passwordLengthCheck.setAttribute("id", "passwordLength");
  formGroups[2].append(passwordLengthCheck);
  const passwordMatchCheck = document.createElement("div");
  passwordMatchCheck.setAttribute("id", "passwordMatch");
  formGroups[3].append(passwordMatchCheck);

  passwordInput.addEventListener("input", function () {
    if (passwordInput.value.length < 5) {
      passwordLengthCheck.innerHTML = "Password is not long enough";
    } else if (passwordInput.value.length > 50) {
      passwordLengthCheck.innerHTML = "Password is too long";
    } else {
      passwordLengthCheck.innerText = "Password is an adequate length";
    }

    if (
      passwordInput.value == passwordInputMatch.value &&
      passwordInput.value != ""
    ) {
      passwordMatchCheck.innerText = "Passwords are a Match";
    } else {
      passwordMatchCheck.innerText = "Passwords do not match";
    }
    if (passwordInput.nextSibling.nextSibling) {
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
      passwordMatchCheck.innerText = "Passwords are a Match";
    } else {
      passwordMatchCheck.innerText = "Passwords do not match";
    }

    if (passwordInputMatch.nextSibling.nextSibling) {
      if (
        passwordInputMatch.nextSibling.nextSibling.classList.contains(
          "formError"
        )
      ) {
        passwordInputMatch.nextSibling.nextSibling.innerText = "";
      }
    }
  });
}

window.addEventListener("mousemove", function () {
  if (
    document.getElementById("usernameAvailability").innerText ==
      "Username is available" &&
    document.getElementById("emailAvailability").innerText ==
      "Email is available" &&
    passwordInput.value == passwordInputMatch.value &&
    passwordInput.value.length > 4 &&
    passwordInput.value.length < 51
  ) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
window.addEventListener("touchstart", function () {
  if (
    document.getElementById("usernameAvailability").innerText ==
      "Username is available" &&
    document.getElementById("emailAvailability").innerText ==
      "Email is available" &&
    passwordInput.value == passwordInputMatch.value &&
    passwordInput.value.length > 4 &&
    passwordInput.value.length < 51
  ) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
