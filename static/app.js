const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("general_search");
const categoryInput = document.getElementById("categories_filter");
const authorInput = document.getElementById("author_filter");
const previewInput = document.getElementById("preview_filter");
const orderByInput = document.getElementById("order_by_filter");
const cardContainer = document.getElementById("cardContainer");
const BASE_URL = "https://www.googleapis.com/books/v1/volumes?";

var currentPage = 1;
var numberPerPage = 9;
var numberOfPages = 1;
var resp = null;

searchForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  parameters = {};
  if (searchInput.value) {
    parameters["q"] = searchInput.value;
  }
  if (categoryInput.value) {
    parameters["subject"] = categoryInput.value;
  }
  if (orderByInput.value) {
    parameters["orderBy"] = orderByInput.value;
  }
  if (previewInput.value) {
    parameters["filter"] = previewInput.value;
  }
  parameters["maxResults"] = 40;
  resp = await axios.get(BASE_URL, {
    params: parameters,
  });
  searchInput.value = "";
  console.log(resp);
  numberOfPages = getNumberOfPages(resp.data.items);
  firstPage(resp.data.items);

  // loadList(resp.data.items);
});

function getNumberOfPages(list) {
  return Math.ceil(list.length / numberPerPage);
}

document.getElementById("next").addEventListener("click", function () {
  nextPage(resp.data.items);
});

document.getElementById("previous").addEventListener("click", function () {
  previousPage(resp.data.items);
});

document.getElementById("first").addEventListener("click", function () {
  firstPage(resp.data.items);
});

document.getElementById("last").addEventListener("click", function () {
  lastPage(resp.data.items);
});

function nextPage(items) {
  currentPage += 1;
  loadList(items);
}

function previousPage(items) {
  currentPage -= 1;
  loadList(items);
}

function firstPage(items) {
  currentPage = 1;
  loadList(items);
}

function lastPage(items) {
  currentPage = numberOfPages;
  loadList(items);
}

function loadList(items) {
  var begin = (currentPage - 1) * numberPerPage;
  var end = begin + numberPerPage;
  addResults(items.slice(begin, end));
  check(); // determines the states of the pagination buttons
}
function check() {
  document.getElementById("next").disabled =
    currentPage == numberOfPages ? true : false;
  document.getElementById("previous").disabled =
    currentPage == 1 ? true : false;
  document.getElementById("first").disabled = currentPage == 1 ? true : false;
  document.getElementById("last").disabled =
    currentPage == numberOfPages ? true : false;
}

function addResults(items) {
  cardContainer.innerHTML = "";
  for (i = 0; i < items.length; i += 3) {
    const newRow = document.createElement("div");
    newRow.setAttribute("class", "d-flex flex-row justify-content-center");
    for (j = i; j < i + 3; j++) {
      if (j >= items.length) {
        cardContainer.append(newRow);
        return;
      }
      const newColumn = document.createElement("div");
      // newColumn.addEventListener("click", function () {
      //   showModal(items[j]);
      // });
      newColumn.setAttribute("class", "col-4");
      try {
        newColumn.setAttribute(
          "data-isbn-10",
          items[j].volumeInfo.industryIdentifiers[0].identifier
        );
      } catch (err) {
        newColumn.setAttribute("data-isbn-10", "N/A");
      }

      newColumn.setAttribute("id", items[j].id);
      // console.log(newColumn);
      buildCard(items[j], newColumn);
      newRow.append(newColumn);
    }
    cardContainer.append(newRow);
  }
}

function buildCard(cardInfo, column) {
  column.setAttribute("class", "cards");
  const cardImg = document.createElement("img");
  cardImg.setAttribute("class", "cardImgSize");
  try {
    cardImg.setAttribute("src", cardInfo.volumeInfo.imageLinks.smallThumbnail);
  } catch (err) {
    cardImg.setAttribute(
      "src",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
    );
  }
  cardImg.setAttribute("alt", "book picture");
  column.append(cardImg);
  const cardTitle = document.createElement("div");
  cardTitle.innerText = cardInfo.volumeInfo.title;
  column.append(cardTitle);
}

// var offsetValue = 0;

// function paginator(resp) {
//   console.log(resp.data.items);
//   nextPageButton.addEventListener("click", async (evt) => {
//     if (offsetValue < resp.data.items.length) {
//       offsetValue = offsetValue + 9;
//       // if (offsetValue > resp.data.items.length) {
//       //   offsetValue =
//       // }
//       console.log(offsetValue);
//       resp.config.params["startIndex"] = offsetValue;
//       resp.config.params["maxResults"] = 10;
//       new_resp = await axios.get(BASE_URL, {
//         params: resp.config.params,
//       });
//       console.log(new_resp);
//       addResults(new_resp.data.items);
//     }
//   });

//   prevPageButton.addEventListener("click", async (evt) => {
//     if (offsetValue > 0) {
//       offsetValue = offsetValue - 9;
//       console.log(offsetValue);
//       resp.config.params["startIndex"] = offsetValue;
//       resp.config.params["maxResults"] = 10;
//       new_resp = await axios.get(BASE_URL, {
//         params: resp.config.params,
//       });
//       addResults(new_resp.data.items);
//     }
//   });
// }
