const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("general_search");
const categoryInput = document.getElementById("categories_filter");
const authorInput = document.getElementById("author_filter");
const previewInput = document.getElementById("preview_filter");
const orderByInput = document.getElementById("order_by_filter");
const cardsAndModal = $("#cardsAndModal");
const BASE_URL_GOOGLE_BOOKS_API =
  "https://www.googleapis.com/books/v1/volumes?";
const BASE_URL_USERS = "/users";
const cardsContainer = document.getElementById("cardsContainer");
const flashContainer = document.getElementById("flashContainer");
const paginateButtons = Array.from(document.getElementsByClassName("paginate"));
const $target = $("html,body");
let userID;
if (document.getElementById("userLoggedIn")) {
  userID = document.getElementById("userLoggedIn").getAttribute("data-user-id");
}

let resp;

searchForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  if (flashContainer) {
    flashContainer.innerHTML = "";
  }

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
  resp = await axios.get(BASE_URL_GOOGLE_BOOKS_API, {
    params: parameters,
  });
  if (resp.data.items == null) {
    alert("Could not find any results, try a different entry");
    searchInput.value = "";
    return;
  }

  numberOfPages = getNumberOfPages(resp.data.items);
  firstPage(resp.data.items);
  $target.animate({ scrollTop: $target.height() }, 3000);
  for (let button of paginateButtons) {
    button.setAttribute("style", "display=initial");
  }
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
        const modal = appendModal();
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
  const modal = appendModal();
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
  if (document.getElementById("userLoggedIn")) {
    const myBooks = document
      .getElementById("userLoggedIn")
      .getAttribute("data-user-books");
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
      <div class="modal-footer d-flex flex-row justify-content-around">
            <a href = ${myBooks}>
               <button type="button" id = "bookButtonFooter" class="btn btn-primary btn-sm">My Books</button>
            </a>
            <button type="button" class="btn btn-danger btn-sm" id = "closeButtonFooter" data-dismiss="modal">Close</button>
        <!--end modal-footer-->
      </div>
      <!--end modal-content-->
    </div>
  </div>
</div>`);

    return $modalMarkupLoggedIn;
  } else {
    const $modalMarkupLoggedOut = $(`
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
      <div class="modal-footer d-flex flex-row" id = "closeButtonDiv">
            <button type="button" class="btn btn-secondary btn-sm" id = "closeButtonFooter" data-dismiss="modal">Close</button>
        <!--end modal-footer-->
      </div>
      <!--end modal-content-->
    </div>
  </div>
</div>`);

    return $modalMarkupLoggedOut;
  }
}

async function addCarousel(items) {
  const holder = $(`#containerFluid`);

  const myBooks = await axios.get(`/API/users/${userID}/books`);

  for (let i = 0; i < items.length; i++) {
    let authors = "";
    let img;
    let paragraph;
    let averageRating;
    let starRating;
    let isbn13;
    let amazonSearch;
    let saveBook = "Save Book";
    try {
      img = items[i].volumeInfo.imageLinks.smallThumbnail;
    } catch (err) {
      img =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
    }
    if (items[i].volumeInfo.description) {
      paragraph = items[i].volumeInfo.description;
    } else {
      paragraph = "A description of this book is not available";
    }
    try {
      if (items[i].volumeInfo.averageRating) {
        averageRating = `${items[i].volumeInfo.averageRating}/5`;
        starRating = items[i].volumeInfo.averageRating;
      } else {
        averageRating = "N/A";
      }
    } catch (err) {
      averageRating = "N/A";
    }

    try {
      if (items[i].volumeInfo.industryIdentifiers) {
        isbn13 = `${items[i].volumeInfo.industryIdentifiers[1].identifier}`;
      } else {
        isbn13 = "N/A";
      }
    } catch (err) {
      isbn13 = "N/A";
    }
    try {
      if (items[i].volumeInfo.authors) {
        for (let j = 0; j < items[i].volumeInfo.authors.length; j++) {
          if (authors == "") {
            authors = items[i].volumeInfo.authors[j];
          } else {
            authors = authors + ", " + items[i].volumeInfo.authors[j];
          }
        }
      } else {
        authors = "N/A";
      }
    } catch {
      authors = "N/A";
    }
    if (authors == "N/A") {
      amazonSearch = items[i].volumeInfo.title + " book";
    } else {
      amazonSearch =
        items[i].volumeInfo.title + " " + items[i].volumeInfo.authors[0];
    }

    for (let k = 0; k < myBooks.data.length; k++) {
      if (myBooks.data[k].id == items[i].id) {
        saveBook = "Book Saved";
        break;
      }
    }

    if (document.getElementById("userLoggedIn")) {
      const infoLoggedIn = $(`<div class="carousel-item container" data-card-clicked = ${i}> 
                        <div class="row justify-content-center">
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
                        <div class = "row justify-content-center carousel-row">
                            <div id = "carouselCaptionDiv" class = "col-12 text-center">
                                  <h3 class="modalTitle">${items[i].volumeInfo.title}</h3>
                                  <h6>${authors}</h6>
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
                       <div class = "row justify-content-center carousel-row">
                            <div class = "col-12 text-center">
                                <div>ISBN-13: ${isbn13}
                                </div>
                            </div>
                        </div>
                        <div class = "row justify-content-between carousel-row mt-2">
                            <div class = "col-3">
                                  <a href = ${items[i].volumeInfo.infoLink} target="_blank">
                                    <button class = "btn btn-info btn-sm">Learn More</button>
                                  </a>
                            </div>
                            <div class = "col-3">
                                    <button data-save-book=${items[i].id} data-user-id =${userID}  id = "saveBook${i}" class = "btn btn-success btn-sm saveBooks">${saveBook}</button>
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
    } else {
      const infoLoggedOut = $(`<div class="carousel-item container" data-card-clicked = ${i}> 
                        <div class="row justify-content-center carousel-row">
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
                        <div class = "row justify-content-center carousel-row">
                            <div id = "carouselCaptionDiv" class = "col-12 text-center">
                                  <h3 class="modalTitle">${items[i].volumeInfo.title}</h3>
                                  <h6>${authors}</h6>
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
                       <div class = "row justify-content-center carousel-row">
                            <div class = "col-12 text-center">
                                <div> ISBN-13: ${isbn13}
                                </div>
                            </div>
                        </div>
                        <div class = "row justify-content-around carousel-row mt-2">
                            <div class = "col-3 d-flex justify-content-center">
                                  <a href = ${items[i].volumeInfo.infoLink} target="_blank">
                                    <button class = "btn btn-success btn-sm">Learn More</button>
                                  </a>
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
                    </div>
`);

      holder.append(infoLoggedOut);
    }
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

    if (document.getElementById("userLoggedIn")) {
      saveBooks(i);
    }
  }
}

function saveBooks(i) {
  const saveBook = document.getElementById(`saveBook${i}`);
  saveBook.addEventListener("click", async function () {
    if (saveBook.innerText == "Book Saved") {
      return;
    }
    const bookID = saveBook.getAttribute("data-save-book");
    response = await axios.post(`${BASE_URL_USERS}/${userID}/books/add`, {
      id: bookID,
    });
    saveBook.innerText = "Book Saved";
  });
}
