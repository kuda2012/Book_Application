const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("general_search");
const categoryInput = document.getElementById("categories_filter");
const authorInput = document.getElementById("author_filter");
const previewInput = document.getElementById("preview_filter");
const orderByInput = document.getElementById("order_by_filter");

const BASE_URL = "https://www.googleapis.com/books/v1/volumes?";
searchForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  resp = await axios.get(BASE_URL, {
    params: {
      q: searchInput.value,
      subject: categoryInput.value,
      orderBy: orderByInput.value,
      filter: previewInput.value,
      maxResults: 10,
    },
  });

  console.log(resp);
});
