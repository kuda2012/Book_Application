const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("general_search");
const categoryInput = document.getElementById("categories_filter");
const authorInput = document.getElementById("author_filter");
const previewInput = document.getElementById("preview_filter");
const orderByInput = document.getElementById("order_by_filter");
const cardContainer = $("#cardContainer");
const BASE_URL = "https://www.googleapis.com/books/v1/volumes?";
const containerUL = document.getElementById("containerUL");

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
  if (resp.data.items == null) {
    alert("Could not find any results, try a different entry");
    searchInput.value = "";
    return;
  }
  searchInput.value = "";
  console.log(resp);
  numberOfPages = getNumberOfPages(resp.data.items);
  firstPage(resp.data.items);
  // createModal(resp.data.items);
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
  containerUL.innerHTML = "";

  if (document.getElementById("myModal")) {
    document.getElementById("myModal").remove();
  }
  for (i = 0; i < items.length; i += 3) {
    const newRow = document.createElement("div");
    newRow.setAttribute("class", "d-flex flex-row");
    for (j = i; j < i + 3; j++) {
      if (j >= items.length) {
        cardContainer.append(newRow);
        return;
      }
      const newColumn = document.createElement("div");
      newColumn.setAttribute("class", "col-sm");
      const newLI = document.createElement("li");
      newLI.setAttribute("data-toggle", "modal");
      newLI.setAttribute("data-target", "#myModal");
      const newAnchor = document.createElement("a");
      newAnchor.setAttribute("href", "#myGallery");
      newAnchor.setAttribute("data-slide-to", j);
      const bookCard = document.createElement("div");
      try {
        bookCard.setAttribute(
          "data-isbn-10",
          items[j].volumeInfo.industryIdentifiers[0].identifier
        );
      } catch (err) {
        bookCard.setAttribute("data-isbn-10", "N/A");
      }

      bookCard.setAttribute("id", items[j].id);
      buildCard(items[j], bookCard);
      newLI.append(newAnchor);
      newLI.append(bookCard);
      newColumn.append(newLI);
      newRow.append(newColumn);
      containerUL.append(newRow);
    }
    cardContainer.append(containerUL);
  }
  const modal = appendModal(items);
  cardContainer.append(modal);
  addCarousel(items);
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
  return column;
}

function appendModal(items) {
  const $modalMarkup = $(`
<div class="modal fade" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <div class="pull-left">My Gallery Title</div>
        <button type="button" class="close" data-dismiss="modal" title="Close">
          <span class="glyphicon glyphicon-remove"></span>
        </button>
      </div>
      <div class="modal-body">
        <!--CAROUSEL CODE GOES HERE-->
        <!--begin carousel-->
        <div id="myGallery" class="carousel slide" data-interval="false">
          <div class="carousel-inner" id="carouselInner">
            <!--end carousel-inner-->
          </div>
          <!--Begin Previous and Next buttons-->
          <a
            class="left carousel-control"
            href="#myGallery"
            role="button"
            data-slide="prev"
          >
            <span class="glyphicon glyphicon-chevron-left"></span
          ></a>
          <a
            class="right carousel-control"
            href="#myGallery"
            role="button"
            data-slide="next"
          >
            <span class="glyphicon glyphicon-chevron-right"></span
          ></a>
          <!--end carousel-->
        </div>
        <!--end modal-body-->
      </div>
      <div class="modal-footer">
        <div class="pull-left"></div>
        <button class="btn-sm close" type="button" data-dismiss="modal">
          Close
        </button>
        <!--end modal-footer-->
      </div>
      <!--end modal-content-->
    </div>
  </div>
</div>`);

  return $modalMarkup;
}

function addCarousel(items) {
  const holder = $(`#carouselInner`);

  const info = $(`<div class="item active"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png" alt="item0">
<div class="carousel-caption">
<h3>${items[0].volumeInfo.title}</h3>
<p>${items[0].volumeInfo.description}</p>
</div>
</div>
`);
  holder.append(info);
}
