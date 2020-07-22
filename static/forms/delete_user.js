const deleteUserInput = document.getElementById("delete_user");
const submitButton = document.getElementById("submitButton");
submitButton.disabled = true;

if (deleteUserInput) {
  // Delete User Logic
  deleteUserInput.addEventListener("input", function () {
    if (deleteUserInput.nextSibling.nextSibling) {
      if (
        deleteUserInput.nextSibling.nextSibling.classList.contains("formError")
      ) {
        deleteUserInput.nextSibling.nextSibling.innerText = "";
      }
    }
  });
}

window.addEventListener("mousemove", function () {
  if (deleteUserInput.value != "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
window.addEventListener("touchstart", function () {
  if (deleteUserInput.value != "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
