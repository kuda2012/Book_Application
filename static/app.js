const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("general_search");
const categoryInput = document.getElementById("categories_filter");
const authorInput = document.getElementById("author_filter");
const previewInput = document.getElementById("preview_filter");
const orderByInput = document.getElementById("order_by_filter");
const cardContainer = document.getElementById("cardContainer");
const nextPageButton = document.getElementById("nextPageButton");
const prevPageButton = document.getElementById("prevPageButton");
const BASE_URL = "https://www.googleapis.com/books/v1/volumes?";

searchForm.addEventListener("submit", async (evt) => {
  offsetValue = 10;
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
  addResults(resp.data.items.slice(0, 9));

  nextPageButton.addEventListener("click", function () {
    console.log(offsetValue);
    if (offsetValue == 10) {
      addResults(resp.data.items.slice(10, 19));
      offsetValue = offsetValue + 10;
    } else if (offsetValue == 20) {
      addResults(resp.data.items.slice(20, 29));
      offsetValue = offsetValue + 10;
    } else if (offsetValue == 30) {
      addResults(resp.data.items.slice(30, 39));
      offsetValue = offsetValue + 10;
    }
  });
  prevPageButton.addEventListener("click", function () {
    console.log(offsetValue);
    if (offsetValue == 20) {
      addResults(resp.data.items.slice(0, 9));
      offsetValue = offsetValue - 10;
    } else if (offsetValue == 30) {
      addResults(resp.data.items.slice(10, 19));
      offsetValue = offsetValue - 10;
    } else if (offsetValue == 40) {
      addResults(resp.data.items.slice(20, 29));
      offsetValue = offsetValue - 10;
    }
  });
});

function addResults(items) {
  cardContainer.innerHTML = "";
  for (i = 0; i < 9; i += 3) {
    const newRow = document.createElement("div");
    newRow.setAttribute("class", "d-flex flex-row justify-content-between");
    for (j = i; j < i + 3; j++) {
      if (j >= items.length) {
        return;
      }
      const newColumn = document.createElement("div");
      newColumn.addEventListener("click", function () {
        showModal(items[j]);
      });
      newColumn.setAttribute("class", "col-4");
      id = null;
      if (items[j].volumeInfo.industryIdentifiers) {
        id = items[j].volumeInfo.industryIdentifiers[0].identifier;
      } else {
        id = items[j].id;
      }
      newColumn.setAttribute("id", id);

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
  var image_link = null;
  if (cardInfo.volumeInfo.imageLinks) {
    image_link = cardInfo.volumeInfo.imageLinks.smallThumbnail;
  } else {
    image_link =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
  }
  cardImg.setAttribute("src", image_link);
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
