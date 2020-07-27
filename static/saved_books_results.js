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
const submitButton = document.getElementById("submitButton");
const userID = document
  .getElementById("userLoggedIn")
  .getAttribute("data-user-id");
var resp_holder = null;
var resp = null;

window.addEventListener("DOMContentLoaded", async (event) => {
  resp = await axios.get(`http://127.0.0.1:5000/API/users/${userID}/books`);
  console.log(resp);
  resp_holder = resp;
  numberOfPages = getNumberOfPages(resp.data);
  firstPage(resp.data);
});

searchForm.addEventListener("submit", async (evt) => {
  if (document.getElementById("showSavedBooks")) {
    document.getElementById("showSavedBooks").remove();
  }
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
  console.log(searchInput.value);
  resp_holder = resp;
  resp = await axios.get(`${BASE_URL_USERS}/${userID}/books/filter?`, {
    params: { query: searchInput.value },
  });
  // console.log(response);
  if (resp.data == null) {
    alert("Could not find any results, try a different entry");
    searchInput.value = "";
    return;
  }

  searchInput.value = "";

  console.log(resp);
  numberOfPages = getNumberOfPages(resp.data);
  firstPage(resp.data);

  const showSavedBooks = $("<button>Show Saved Books</button>");
  showSavedBooks.attr({ id: "showSavedBooks", class: "btn btn-secondary" });
  showSavedBooks.insertAfter($`#searchForm`);

  showSavedBooks.on("click", async (event) => {
    resp = await axios.get(`http://127.0.0.1:5000/API/users/${userID}/books`);
    console.log(resp);
    numberOfPages = getNumberOfPages(resp.data);
    firstPage(resp.data);
  });
  showSavedBooks.remove();
});

function pageResults(items) {
  cardsAndModal.innerHTML = "";
  cardsContainer.innerHTML = "";

  if (document.getElementById("myModal")) {
    document.getElementById("myModal").remove();
  }
  for (i = 0; i < items.length; i += 3) {
    const newRow = document.createElement("div");
    newRow.setAttribute("class", "d-flex flex-row");
    for (j = i; j < i + 3; j++) {
      if (j == items.length) {
        cardsAndModal.append(cardsContainer);
        const modal = appendModal(items);
        cardsAndModal.append(modal);
        addCarousel(items);
        return;
      }
      const newColumn = document.createElement("div");
      newColumn.setAttribute(
        "class",
        "col-sm d-flex justify-content-center text-center"
      );
      const newAnchor = document.createElement("a");
      newAnchor.setAttribute("href", "#myGallery");
      newAnchor.setAttribute("data-slide-to", j);
      const bookCard = document.createElement("div");

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
  if (document.getElementById("userLoggedIn")) {
    const myBooks = document
      .getElementById("userLoggedIn")
      .getAttribute("data-user-books");
    const $modalMarkupLoggedIn = $(`
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
            <div  id ="containerFluid" >
            </div>
          </div>
          <!--Begin Previous and Next buttons-->
          <!--end carousel-->
        </div>
        <!--end modal-body-->
      </div>
      <div class="modal-footer flex-row">
          <div class = "col d-flex justify-content-end" id = "closeButtonDiv">
            <button type="button" class="btn btn-secondary" id = "closeButtonFooter" data-dismiss="modal">Close</button>
          </div>
        <!--end modal-footer-->
      </div>
      <!--end modal-content-->
    </div>
  </div>
</div>`);
    return $modalMarkupLoggedIn;
  }
}

function addCarousel(items) {
  const holder = $(`#containerFluid`);
  var img;
  var paragraph;
  var averageRating = "";
  var isbn13;
  var amazonSearch;

  for (let i = 0; i < items.length; i++) {
    img = items[i].thumbnail;
    paragraph = items[i].description;
    var spaced_authors = "";
    try {
      if (items[i].authors) {
        for (author of items[i].authors) {
          if (spaced_authors == "") {
            spaced_authors = author;
          } else {
            spaced_authors = author + ", " + spaced_authors;
          }
        }
      } else {
        spaced_authors = "N/A";
      }
    } catch {
      spaced_authors = "N/A";
    }
    if (spaced_authors == "N/A") {
      amazonSearch = items[i].volumeInfo.title + " book";
    } else {
      amazonSearch = items[i].title + " " + items[i].authors[0];
      console.log(amazonSearch);
      amazonSearch = amazonSearch.replace(/['"]+/g, "");
      console.log(amazonSearch);
    }

    try {
      if (items[i].rating != "N/A") {
        averageRating = `${items[i].rating}/5`;
      } else {
        averageRating = "N/A";
      }
    } catch (err) {
      averageRating = "N/A";
    }
    try {
      if (items[i].isbn13) {
        isbn13 = `${items[i].isbn13}`;
      }
    } catch (err) {
      isbn13 = "N/A";
    }

    if (document.getElementById("userLoggedIn")) {
      const infoLoggedIn = $(`<div class="carousel-item container" data-card-clicked = ${i}> 
                        <div class="row carousel-row">
                              <div class = "col-3 d-flex justify-content-center">
                                    <a
                                        class="carousel-control-prev"
                                        href="#myGallery"
                                        role="button"
                                       data-slide="prev" >
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                       <span class="sr-only">Previous</span>
                                    </a>
                              </div>  

                              <div class = "col-6 d-flex justify-content-center">
                                <img class = "cardImgSize" src=${img} alt="item${i}">
                              </div>  
                              <div class = "col-3 d-flex justify-content-center">
                                  <a
                                    class="carousel-control-next"
                                    href="#myGallery"
                                    role="button"
                                    data-slide="next"
                                  >
                                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                      <span class="sr-only">Next</span>
                                    </a>      
                              </div>                
                        </div>
                        <div class = "row carousel-row">
                            <div id = "carouselCaptionDiv" class = "col-12 text-center">
                                  <h3 class="modalTitle">${items[i].title}</h3>
                                  <h6>${spaced_authors}</h6>
                                  <p class = "modalParagraph">${paragraph}</p>
                            </div>
                        </div>
                        <div class = "row  carousel-row">
                            <div class = "col-12 text-center">
                                <div>Average Rating: ${averageRating}
                                </div>
                            </div>
                        </div>
                       <div class = "row  carousel-row">
                            <div class = "col-12 text-center">
                                <div>ISBN-13: ${isbn13}
                                </div>
                            </div>
                        </div>
                        <div class = "row justify-content-around carousel-row">
                            <div class = "col-3">
                                  <a href = ${items[i].info}>
                                    <button class = "btn btn-info">Learn More</button>
                                  </a>
                            </div>
                            <div class = "col-3">
                                    <button data-save-book=${items[i].id} data-user-id =${userID}  id = "saveBook${i}" class = "btn btn-success deleteBooks ">Remove Book</button>
                            </div>
                            <div class = "col-3">
                            <FORM action="http://www.amazon.com/exec/obidos/external-search"[RETURN]
                                  method="get">
                                <INPUT type="hidden"  name="keyword" size="10" value='${amazonSearch}'>
                                <button  class ="btn btn-warning" >Amazon Search</button>
                                </FORM>
                            </div>                           
                        </div>
                    </div>
`);
      holder.append(infoLoggedIn);
    }
    if (document.getElementById("userLoggedIn")) {
      removeBooks(i);
    }
  }
}

function removeBooks(i) {
  const deleteBook = document.getElementById(`saveBook${i}`);
  deleteBook.addEventListener("click", async function () {
    if (deleteBook.innerText == "Book Deleted") {
      return;
    }
    const bookID = deleteBook.getAttribute("data-save-book");
    // console.log(bookID);
    const response = await axios.post(
      `${BASE_URL_USERS}/${userID}/books/delete`,
      {
        id: bookID,
      }
    );
    deleteBook.innerText = "Book Deleted";
    // console.log(response);
    removeBookHTML(bookID);
  });
}

async function removeBookHTML(id) {
  const carouselItem = Array.from(document.getElementsByClassName("active"));
  carouselItem[0].remove();
  const bookCard = document.getElementById(id);
  bookCard.click();
  bookCard.remove();
  for (let i = 0; i < resp.data.length; i++) {
    if (resp.data[i].id == id) {
      resp.data.splice(i, 1);
    }
  }
  numberOfPages = getNumberOfPages(resp.data);

  if (currentPage > numberOfPages) {
    currentPage = numberOfPages;
  }
  loadList(resp.data);

  if (resp.data.length == 0 && resp_holder.data.length == 0) {
    window.location.href = "/";
  } else if (resp.data.length == 0) {
    window.location.href = "/";
  } else if (resp.data.length == 0 && resp_holder.data.length > 0) {
    resp = await axios.get(`http://127.0.0.1:5000/API/users/${userID}/books`);
    console.log(resp);
    numberOfPages = getNumberOfPages(resp.data);
    firstPage(resp.data);
  }
}
