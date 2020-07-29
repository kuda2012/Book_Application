const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submitButton");
submitButton.disabled = false;

usernameInput.addEventListener("click", function () {
  if (usernameInput.nextSibling.nextSibling) {
    usernameInput.nextSibling.nextSibling.innerText = "";
  }
});

passwordInput.addEventListener("click", function () {
  if (passwordInput.nextSibling.nextSibling) {
    passwordInput.nextSibling.nextSibling.innerText = "";
  }
});
