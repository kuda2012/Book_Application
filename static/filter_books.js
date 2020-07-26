const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("general_search");
const cardsAndModal = $("#cardsAndModal");
const BASE_URL_GOOGLE_BOOKS_API =
  "https://www.googleapis.com/books/v1/volumes?";
const BASE_URL_USERS = "http://127.0.0.1:5000/users";
const cardsContainer = document.getElementById("cardsContainer");
const flashContainer = document.getElementById("flashContainer");

searchForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  if (flashContainer) {
    flashContainer.innerHTML = "";
  }

  parameters = {};
  if (searchInput.value) {
    parameters["q"] = searchInput.value;
  }
  if (searchInput.value == "") {
    alert("Please enter an input to search for");
    return;
  }
  const response = await axios.post(
    `${BASE_URL_USERS}/${userID}/books/filter`,
    {
      query: searchInput.value,
    }
  );
  if (resp.data.items == null) {
    alert("Could not find any results, try a different entry");
    searchInput.value = "";
    return;
  }

  searchInput.value = "";

  console.log(response);
  numberOfPages = getNumberOfPages(resp.data.items);
  firstPage(resp.data.items);
});
