const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submitButton");
submitButton.disabled = false;

// window.addEventListener("mousemove", function () {
//   console.log(usernameInput.value, passwordInput.value);
//   if (usernameInput.value != "" && passwordInput.value.length != "") {
//     submitButton.disabled = false;
//   }
// });
// window.addEventListener("touchstart", function () {
//   if (usernameInput.value != "" && passwordInput.value.length != "") {
//     submitButton.disabled = false;
//   } else {
//     submitButton.disabled = true;
//   }
// });

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
