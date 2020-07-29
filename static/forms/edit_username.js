const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submitButton");
const BASE_URL_USERNAMES = "http://127.0.0.1:5000/usernames/all";
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
window.addEventListener("mousemove", function () {
  if (
    document.getElementById("usernameAvailability").innerText ==
      "Username is available" &&
    passwordInput.value != ""
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
    passwordInput.value != ""
  ) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
