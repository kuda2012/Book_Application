const newPasswordInput = document.getElementById("new_password");
const passwordInput = document.getElementById("password");
const passwordInputMatch = document.getElementById("new_password_match");
const submitButton = document.getElementById("submitButton");
// submitButton.disabled = true;

if (passwordInputMatch) {
  const formGroups = Array.from(document.querySelectorAll(".form-group"));
  const passwordLengthCheck = document.createElement("div");
  passwordLengthCheck.setAttribute("id", "passwordLength");
  formGroups[1].append(passwordLengthCheck);
  const passwordMatchCheck = document.createElement("div");
  passwordMatchCheck.setAttribute("id", "passwordMatch");
  formGroups[2].append(passwordMatchCheck);

  passwordInput.addEventListener("input", function () {
    if (passwordInput.nextSibling.nextSibling) {
      if (
        passwordInput.nextSibling.nextSibling.classList.contains("formError")
      ) {
        passwordInput.nextSibling.nextSibling.innerText = "";
      }
    }
  });
  newPasswordInput.addEventListener("input", function () {
    if (newPasswordInput.value.length < 5) {
      passwordLengthCheck.innerHTML = "Password is not long enough";
    } else if (newPasswordInput.value.length > 50) {
      passwordLengthCheck.innerHTML = "Password is too long";
    } else {
      passwordLengthCheck.innerText = "Password is an adequate length";
    }

    if (
      newPasswordInput.value == passwordInputMatch.value &&
      newPasswordInput.value != ""
    ) {
      passwordMatchCheck.innerText = "Passwords are a Match";
    } else {
      passwordMatchCheck.innerText = "Passwords do not match";
    }
    if (newPasswordInput.nextSibling.nextSibling) {
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
        passwordInputMatch.nextSibling.nextSibling.innerText = "";
      }
    }
  });
}
// window.addEventListener("mousemove", function () {
//   if (
//     document.getElementById("passwordMatch").innerText ==
//       "Passwords are a Match" &&
//     passwordInput.value != "" &&
//     newPasswordInput.value.length > 4 &&
//     newPasswordInput.value.length < 51
//   ) {
//     submitButton.disabled = false;
//   } else {
//     submitButton.disabled = true;
//   }
// });
// window.addEventListener("touchstart", function () {
//   if (
//     document.getElementById("passwordMatch").innerText ==
//       "Passwords are a Match" &&
//     passwordInput.value != "" &&
//     newPasswordInput.value.length > 4 &&
//     newPasswordInput.value.length < 51
//   ) {
//     submitButton.disabled = false;
//   } else {
//     submitButton.disabled = true;
//   }
// });
