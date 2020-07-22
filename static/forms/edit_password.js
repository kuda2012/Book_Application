const newPasswordInput = document.getElementById("new_password");
const passwordInput = document.getElementById("password");
const passwordInputMatch = document.getElementById("new_password_match");
const submitButton = document.getElementById("submitButton");
submitButton.disabled = true;

if (passwordInputMatch) {
  const passwordMatchCheck = document.createElement("div");
  passwordMatchCheck.setAttribute("id", "passwordMatch");
  const formGroups = Array.from(document.querySelectorAll(".form-group"));
  formGroups[2].append(passwordMatchCheck);

  passwordInput.addEventListener("input", function () {
    if (passwordInput.nextSibling.nextSibling) {
      // console.log(passwordInput.nextSibling.nextSibling);
      if (
        passwordInput.nextSibling.nextSibling.classList.contains("formError")
      ) {
        passwordInput.nextSibling.nextSibling.innerText = "";
      }
    }
  });
  newPasswordInput.addEventListener("input", function () {
    if (
      newPasswordInput.value == passwordInputMatch.value &&
      newPasswordInput.value != ""
    ) {
      passwordMatchCheck.innerText = "Passwords are a Match";
    } else {
      passwordMatchCheck.innerText = "Passwords do not match";
    }
    if (newPasswordInput.nextSibling.nextSibling) {
      // console.log(passwordInput.nextSibling.nextSibling);
      if (
        newPasswordInput.nextSibling.nextSibling.classList.contains("formError")
      ) {
        newPasswordInput.nextSibling.nextSibling.innerText = "";
      }
    }
  });
  passwordInputMatch.addEventListener("input", function () {
    if (
      newPasswordInput.value == passwordInputMatch.value &&
      newPasswordInput.value != ""
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
        //   console.log(passwordInputMatch.nextSibling.nextSibling);
        passwordInputMatch.nextSibling.nextSibling.innerText = "";
      }
    }
  });
}
window.addEventListener("mousemove", function () {
  if (
    document.getElementById("passwordMatch").innerText ==
      "Passwords are a Match" &&
    passwordInput.value != ""
  ) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
window.addEventListener("touchstart", function () {
  if (
    document.getElementById("passwordMatch").innerText ==
      "Passwords are a Match" &&
    passwordInput.value != ""
  ) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
