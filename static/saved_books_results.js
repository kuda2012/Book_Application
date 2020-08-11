const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("general_search");
const categoryInput = document.getElementById("categories_filter");
const authorInput = document.getElementById("author_filter");
const orderByInput = document.getElementById("order_by_filter");
const cardsAndModal = $("#cardsAndModal");
const BASE_URL_GOOGLE_BOOKS_API =
  "https://www.googleapis.com/books/v1/volumes?";
const BASE_URL_USERS = "/users";
const cardsContainer = document.getElementById("cardsContainer");
const submitButton = document.getElementById("submitButton");
const paginateButtons = Array.from(document.getElementsByClassName("paginate"));
const userID = document
  .getElementById("userLoggedIn")
  .getAttribute("data-user-id");
let respHolder;
let resp;

window.addEventListener("DOMContentLoaded", async () => {
  resp = await axios.get(`/API/users/${userID}/books`);

  respHolder = resp;
  numberOfPages = getNumberOfPages(resp.data);
  if (numberOfPages == 1) {
    for (let button of paginateButtons) {
      button.style.display = "none";
    }
  }

  firstPage(resp.data);
});

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

  resp = await axios.get(`${BASE_URL_USERS}/${userID}/books/filter?`, {
    params: { query: searchInput.value },
  });
  if (resp.data.length == 0) {
    alert("Could not find any results, try a different entry");
    searchInput.value = "";
    resp = respHolder;
    return;
  }

  searchInput.value = "";
  numberOfPages = getNumberOfPages(resp.data);
  firstPage(resp.data);
  if (document.getElementById("showSavedBooks")) {
    document.getElementById("showSavedBooks").remove();
  }
  const showSavedBooks = $("<button>Back</button>");
  showSavedBooks.attr({ id: "showSavedBooks", class: "btn btn-danger ml-2" });
  showSavedBooks.insertAfter($`#searchForm`);

  showSavedBooks.on("click", async () => {
    resp = await axios.get(`/API/users/${userID}/books`);
    numberOfPages = getNumberOfPages(resp.data);
    firstPage(resp.data);
    showSavedBooks.remove();
  });
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
  const $modalMarkupLoggedIn = $(`
<div class="modal fade" id="myModal"  role="dialog" aria-labelledby="exampleModalLabel aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
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
          <div class = "col d-flex justify-content-end" >
            <button type="button" class="btn btn-secondary btn-sm" id = "closeButtonFooterSaved" data-dismiss="modal">Close</button>
          </div>
        <!--end modal-footer-->
      </div>
      <!--end modal-content-->
    </div>
  </div>
</div>`);
  return $modalMarkupLoggedIn;
}

function addCarousel(items) {
  const holder = $(`#containerFluid`);
  let img;
  let paragraph;
  let averageRating = "";
  let starRating;
  let isbn13;
  let amazonSearch;

  for (let i = 0; i < items.length; i++) {
    img = items[i].thumbnail;
    paragraph = items[i].description;
    let spaced_authors = "";
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
      amazonSearch = items[i].title + " book";
    } else {
      amazonSearch = items[i].title + " " + items[i].authors[0];

      amazonSearch = amazonSearch.replace(/['"]+/g, "");
    }

    try {
      if (items[i].rating != "N/A") {
        averageRating = `${items[i].rating}/5`;
        starRating = items[i].rating;
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
                      <div class = "row justify-content-center carousel-row">
                            <div class = "col-12 text-center">
                                <div>Average Rating: ${averageRating}</div>
                            </div>
                        </div>
                         <div class = "row justify-content-center carousel-row">
                            <div class = "d-flex justify-content-center col-12 ">
                                <p><span class="stars" id = ${i}></span></p>
                            </div>
                        </div>  
                       <div class = "row  carousel-row">
                            <div class = "col-12 text-center">
                                <div>ISBN-13: ${isbn13}
                                </div>
                            </div>
                        </div>
                        <div class = "row justify-content-around carousel-row mt-2">
                            <div class = "col-3">
                                  <a href = ${items[i].info} target="_blank">
                                    <button class = "btn btn-info btn-sm">Learn More</button>
                                  </a>
                            </div>
                            <div class = "col-3">
                                    <button data-save-book=${items[i].id} data-user-id =${userID}  id = "saveBook${i}" class = "btn btn-success btn-sm deleteBooks ">Remove Book</button>
                            </div>
                            <div class = "col-3">
                            <FORM action="http://www.amazon.com/exec/obidos/external-search"
                                  method="get" target="_blank">
                                <INPUT type="hidden"  name="keyword" size="10" value='${amazonSearch}'>
                                <button  class ="btn btn-warning btn-sm" >Amazon Search</button>
                                </FORM>
                            </div>                           
                        </div>
                    </div>
`);
      holder.append(infoLoggedIn);
      let starWidth = 40;

      $.fn.stars = function () {
        return $(this).each(function () {
          $(this).html(
            $("<span />").width(
              Math.max(0, Math.min(5, parseFloat($(this).html()))) * starWidth
            )
          );
        });
      };
      if (averageRating != "N/A") {
        document.getElementById(i).innerText = starRating;
        $(`#${i}`).stars();
      } else {
        $(`#${i}`).parent().remove();
      }
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
    await axios.post(`${BASE_URL_USERS}/${userID}/books/delete`, {
      id: bookID,
    });
    deleteBook.innerText = "Book Deleted";
    removeBookHTML(bookID);
  });
}

async function removeBookHTML(id) {
  const carouselItem = Array.from(document.getElementsByClassName("active"));
  carouselItem[0].remove();
  const bookCard = document.getElementById(id);
  bookCard.click();
  bookCard.remove();
  if (document.getElementById("showSavedBooks")) {
    document.getElementById("showSavedBooks").remove();
  }
  for (let i = 0; i < resp.data.length; i++) {
    if (resp.data[i].id == id) {
      resp.data.splice(i, 1);
    }
  }
  for (let i = 0; i < respHolder.data.length; i++) {
    if (respHolder.data[i].id == id) {
      respHolder.data.splice(i, 1);
    }
  }
  numberOfPages = getNumberOfPages(resp.data);

  if (currentPage > numberOfPages) {
    currentPage = numberOfPages;
  }
  loadList(resp.data);

  if (resp.data.length == 0 && respHolder.data.length == 0) {
    window.location.href = "/";
  } else {
    resp = await axios.get(`/API/users/${userID}/books`);
    numberOfPages = getNumberOfPages(resp.data);
    firstPage(resp.data);
  }
}
