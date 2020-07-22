const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submitButton");
submitButton.disabled = false;

window.addEventListener("mousemove", function () {
  if (usernameInput.value != "" && passwordInput.value.length != "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
window.addEventListener("touchstart", function () {
  if (usernameInput.value != "" && passwordInput.value.length != "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
