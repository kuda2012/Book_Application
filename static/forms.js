const editUsernameInput = document.getElementById("username");
const usernameAvailability = document.getElementById("usernameAvailability");
const newPasswordInput = document.getElementById("new_password");
const newPasswordInputMatch = document.getElementById("new_password_match");
const BASE_URL_USERNAMES = "http://127.0.0.1:5000/usernames/all";
const submitButton = document.getElementById("submitButton");

if (editUsernameInput) {
  editUsernameInput.addEventListener("input", async function () {
    resp = await axios.get(BASE_URL_USERNAMES, {
      params: { username: editUsernameInput.value },
    });
    usernameAvailability.innerText = resp.data;
    console.log(resp);
  });
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
