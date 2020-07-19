const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("general_search");
const categoryInput = document.getElementById("categories_filter");
const authorInput = document.getElementById("author_filter");
const previewInput = document.getElementById("preview_filter");
const orderByInput = document.getElementById("order_by_filter");
const cardsAndModal = $("#cardsAndModal");
const BASE_URL = "https://www.googleapis.com/books/v1/volumes?";
const cardsContainer = document.getElementById("cardsContainer");

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
  if (searchInput.value == "") {
    alert("Please enter an input to search for");
    return;
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
  orderByInput.value = "";
  previewInput.value = "";
  categoryInput.value = "";

  console.log(resp);
  numberOfPages = getNumberOfPages(resp.data.items);
  firstPage(resp.data.items);
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
  check();
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
  cardsAndModal.innerHTML = "";
  cardsContainer.innerHTML = "";

  if (document.getElementById("myModal")) {
    document.getElementById("myModal").remove();
  }
  for (i = 0; i < items.length; i += 3) {
    const newRow = document.createElement("div");
    newRow.setAttribute("class", "d-flex flex-row justify-content-between");
    for (j = i; j < i + 3; j++) {
      if (j == items.length) {
        return;
      }
      const newColumn = document.createElement("div");
      newColumn.setAttribute("class", "col-sm");
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
      bookCard.setAttribute("data-toggle", "modal");
      bookCard.setAttribute("data-target", "#myModal");
      buildCard(items[j], bookCard, j);
      newColumn.append(newAnchor);
      newColumn.append(bookCard);
      newRow.append(newColumn);
      cardsContainer.append(newRow);
    }
  }
  cardsAndModal.append(cardsContainer);
  const modal = appendModal(items);
  cardsAndModal.append(modal);
  addCarousel(items);
}

function buildCard(cardInfo, column, index) {
  column.setAttribute("class", `cards`);
  column.setAttribute("data-card-clicked", index);
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

  column.addEventListener("click", function () {
    const carouselItems = document.querySelectorAll(`.carousel-item`);
    for (let i = 0; i < carouselItems.length; i++) {
      if (carouselItems[i].classList.contains(`active`)) {
        carouselItems[i].classList.remove("active");
      }
      if (carouselItems[i].getAttribute("data-card-clicked") == index) {
        carouselItems[i].classList.add("active");
      }
    }
  });
  return column;
}

function appendModal() {
  const $modalMarkup = $(`
<div class="modal fade" id="myModal"  role="dialog" aria-labelledby="exampleModalLabel aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class= "modal-title" id="exampleModalLabel">Page ${currentPage}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <!--CAROUSEL CODE GOES HERE-->
        <!--begin carousel-->
        <div id="myGallery" class="carousel slide" data-interval="false" data-ride="carousel">
          <div class="carousel-inner" id="carouselInner">
            <div class="container-fluid" id ="containerFluid">
              </div>
          </div>
          <!--Begin Previous and Next buttons-->
          <a
            class="carousel-control-prev"
            href="#myGallery"
            role="button"
            data-slide="prev"
          >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span></a>
          <a
            class="carousel-control-next"
            href="#myGallery"
            role="button"
            data-slide="next"
          >
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span></a>
          <!--end carousel-->
        </div>
        <!--end modal-body-->
      </div>
      <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
  const holder = $(`#containerFluid`);
  var img;
  var paragraph;
  var authors = "";
  for (let i = 0; i < items.length; i++) {
    if (items[i].volumeInfo.imageLinks) {
      img = items[i].volumeInfo.imageLinks.smallThumbnail;
    } else {
      img =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
    }
    if (items[i].volumeInfo.description) {
      paragraph = items[i].volumeInfo.description;
    } else {
      paragraph = "A description of this book is not available";
    }

    if (items[i].volumeInfo.authors) {
      for (let j = 0; j < items[i].volumeInfo.authors.length; j++) {
        if (authors == "") {
          authors = items[i].volumeInfo.authors[j];
        } else {
          authors = authors + ", " + items[i].volumeInfo.authors[j];
        }
      }
    }

    const info = $(`<div class="carousel-item" data-card-clicked = ${i}> 
                        <div class="row justify-content-center">
                            <div class = "col-md-8">
                              <img src=${img} alt="item${i}">
                            </div>                     
                        </div>
                        <div class = "row justify-content-center">
                            <div id = "carouselCaptionDiv" class = "col-md-12">
                                  <h3 class="modalTitle">${items[i].volumeInfo.title}</h3>
                                  <h6>${authors}</h6>
                                  <p class = "modalParagraph">${paragraph}</p>
                            </div>
                        </div>
                        <div class = "row justify-content-center">
                            <div class = "col-md-12">
                                  <a href = ${items[i].volumeInfo.infoLink}>
                                    <button class = "btn btn-success">Learn More</button>
                                  </a>
                            </div>
                        </div>
                    </div>
`);

    holder.append(info);
  }
}
