const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("general_search");
const categoryInput = document.getElementById("categories_filter");
const authorInput = document.getElementById("author_filter");
const orderByInput = document.getElementById("order_by_filter");
const cardsAndModal = $("#cardsAndModal");
const BASE_URL_GOOGLE_BOOKS_API =
  "https://www.googleapis.com/books/v1/volumes?";
const BASE_URL_USERS = "http://127.0.0.1:5000/users";
const cardsContainer = document.getElementById("cardsContainer");

var resp = null;

window.addEventListener("DOMContentLoaded", async (event) => {
  resp = await axios.get("http://127.0.0.1:5000/API/users/1/books");
  console.log(resp);
  numberOfPages = getNumberOfPages(resp.data);
  firstPage(resp.data);
});

// searchForm.addEventListener("submit", async (evt) => {
//   evt.preventDefault();
//   parameters = {};
//   if (searchInput.value) {
//     parameters["q"] = searchInput.value;
//   }
//   if (categoryInput.value) {
//     parameters["subject"] = categoryInput.value;
//   }
//   if (orderByInput.value) {
//     parameters["orderBy"] = orderByInput.value;
//   }
//   if (previewInput.value) {
//     parameters["filter"] = previewInput.value;
//   }
//   if (searchInput.value == "") {
//     alert("Please enter an input to search for");
//     return;
//   }
//   parameters["maxResults"] = 40;
//   resp = await axios.get(BASE_URL_GOOGLE_BOOKS_API, {
//     params: parameters,
//   });
//   if (resp.data.items == null) {
//     alert("Could not find any results, try a different entry");
//     searchInput.value = "";
//     return;
//   }

//   searchInput.value = "";
//   orderByInput.value = "";
//   previewInput.value = "";
//   categoryInput.value = "";

//   console.log(resp);
//   numberOfPages = getNumberOfPages(resp.data.items);
//   firstPage(resp.data.items);
// });

function pageResults(items) {
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
        cardsAndModal.append(cardsContainer);
        const modal = appendModal(items);
        cardsAndModal.append(modal);
        addCarousel(items);
        return;
      }
      const newColumn = document.createElement("div");
      newColumn.setAttribute("class", "col-sm");
      const newAnchor = document.createElement("a");
      newAnchor.setAttribute("href", "#myGallery");
      newAnchor.setAttribute("data-slide-to", j);
      const bookCard = document.createElement("div");
      // try {
      //   bookCard.setAttribute(
      //     "data-isbn-10",
      //     items[j].volumeInfo.industryIdentifiers[0].identifier
      //   );
      // } catch (err) {
      //   bookCard.setAttribute("data-isbn-10", "N/A");
      // }
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
    cardImg.setAttribute("src", cardInfo.thumbnail);
  } catch (err) {
    cardImg.setAttribute(
      "src",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
    );
  }
  cardImg.setAttribute("alt", "book picture");
  column.append(cardImg);
  const cardTitle = document.createElement("div");
  cardTitle.innerText = cardInfo.title;
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
  var author_items;
  for (let i = 0; i < items.length; i++) {
    img = items[i].thumbnail;
    paragraph = items[i].description;
    if (items[i].authors) {
      var regex = /"(.*?)"/;
      authors = items[i].authors.match(regex);

      console.log(authors);
      // for (let j = 0; j < items[i].authors.length; j++) {
      //   if (authors == "") {
      //   } else {
      //     authors = authors + ", " + items[i].authors[j];
      //   }
      // }
    }

    if (document.getElementById("userLoggedIn")) {
      const myBooks = document
        .getElementById("userLoggedIn")
        .getAttribute("data-user-books");
      const userID = document
        .getElementById("userLoggedIn")
        .getAttribute("data-user-id");
      const infoLoggedIn = $(`<div class="carousel-item" data-card-clicked = ${i}> 
                        <div class="row justify-content-center carousel-row">
                            <div class = "col-md-8">
                              <img class = "cardImgSize" src=${img} alt="item${i}">
                            </div>                     
                        </div>
                        <div class = "row justify-content-center carousel-row">
                            <div id = "carouselCaptionDiv" class = "col-md-12">
                                  <h3 class="modalTitle">${items[i].title}</h3>
                                  <h6>${authors}</h6>
                                  <p class = "modalParagraph">${paragraph}</p>
                            </div>
                        </div>
                        <div class = "row justify-content-center carousel-row">
                            <div class = "col-md-12">
                                  <a href = ${items[i].info}>
                                    <button class = "btn btn-success">Learn More</button>
                                  </a>
                            </div>
                        </div>
                      <div class = "row justify-content-center carousel-row">
                            <div class = "col-md-12">
                                  <a href = ${myBooks}>
                                    <button class = "btn btn-primary">My books</button>
                                  </a>
                            </div>
                        </div>
                      <div class = "row justify-content-center carousel-row">
                            <div class = "col-md-12">
                                    <button data-save-book=${items[i].id} data-user-id =${userID}  id = "saveBook${i}" class = "btn btn-primary">Save to your books</button>
                            </div>
                        </div>
                    </div>
`);
      holder.append(infoLoggedIn);
    } else {
      const infoLoggedOut = $(`<div class="carousel-item" data-card-clicked = ${i}> 
                        <div class="row justify-content-center carousel-row">
                            <div class = "col-md-8">
                              <img src=${img} alt="item${i}">
                            </div>                     
                        </div>
                        <div class = "row justify-content-center carousel-row">
                            <div id = "carouselCaptionDiv" class = "col-md-12">
                                  <h3 class="modalTitle">${items[i].title}</h3>
                                  <h6>${authors}</h6>
                                  <p class = "modalParagraph">${paragraph}</p>
                            </div>
                        </div>
                        <div class = "row justify-content-center carousel-row">
                            <div class = "col-md-12">
                                  <a href = ${items[i].info}>
                                    <button class = "btn btn-success">Learn More</button>
                                  </a>
                            </div>
                        </div>
                    </div>
`);

      holder.append(infoLoggedOut);
    }
    if (document.getElementById("userLoggedIn")) {
      saveBooks(i);
    }
  }
}

function saveBooks(i) {
  const saveBook = document.getElementById(`saveBook${i}`);
  saveBook.addEventListener("click", async function () {
    const bookID = saveBook.getAttribute("data-save-book");
    console.log(bookID);
    const userID = saveBook.getAttribute("data-user-id");
    response = await axios.post(`${BASE_URL_USERS}/${userID}/books/add`, {
      id: bookID,
    });
    console.log(response);
  });
}
