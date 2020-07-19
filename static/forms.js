const editUsernameInput = document.getElementById("edit_username");
const BASE_URL = "http://127.0.0.1:5000/usernames/all";

editUsernameInput.addEventListener("keydown", async function () {
  resp = await axios.get(BASE_URL, {
    params: parameters,
  });
});
