const editUsernameInput = document.getElementById("username");
const usernameAvailability = document.getElementById("usernameAvailability");
const BASE_URL_USERNAMES = "http://127.0.0.1:5000/usernames/all";

editUsernameInput.addEventListener("input", async function () {
  resp = await axios.get(BASE_URL_USERNAMES, {
    params: { username: editUsernameInput.value },
  });
  usernameAvailability.innerText = resp.data;
  console.log(resp);
});
