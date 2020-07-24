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
  // console.log(resp);
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
      // bookCard.setAttribute("data-backdrop", "false");
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
      <div class="modal-footer d-flex flex-row justify-content-around">
            <a href = ${myBooks}>
               <button type="button" id = "bookButtonFooter" class="btn btn-primary">My Books</button>
            </a>
            <button type="button" class="btn btn-danger" id = "closeButtonFooter" data-dismiss="modal">Close</button>
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
  var authors = "";
  var averageRating = "";
  var isbn13;
  var replace_1;
  for (let i = 0; i < items.length; i++) {
    img = items[i].thumbnail;
    paragraph = items[i].description;
    if (items[i].authors) {
      // console.log(items[i].authors);
      // console.log(items[i].authors.search(/{"/gi));
      if (items[i].authors.search(/{"/gi) == 0) {
        replace_1 = items[i].authors.replace(/{/g, "[");
        replace_1 = replace_1.replace(/}/g, "]");
        authors = replace_1;
        authors = JSON.parse(authors);
        authors = authors.reverse();
        // console.log(authors);
      } else if (items[i].authors.search(/{/gi) == 0) {
        replace_1 = items[i].authors.replace(/{/g, `["`);
        replace_1 = replace_1.replace(/}/g, `"]`);
        authors = replace_1;
        authors = JSON.parse(authors);
        authors = authors.reverse();
        // console.log(authors);
      }

      // authors = JSON.parse(authors);
      // authors = authors.reverse();
      // try {
      //   authors = JSON.parse(replace_1);
      //   authors = authors.reverse();
      // } catch {
      //   authors = replace_1;
      //   console.log(authors);
      //   // author = JSON.parse(authors);
      // }

      // console.log(authors);

      var spaced_authors = "";
      for (author of authors) {
        if (spaced_authors == "") {
          spaced_authors = author;
        } else {
          spaced_authors = author + ", " + spaced_authors;
        }
      }
      try {
        if (items[i].rating) {
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
      // console.log(spaced_authors);

      // var regex = /"(.*?)"/;
      // authors = items[i].authors.match(regex);

      // console.log(authors);
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
                        <div class = "row  carousel-row">
                            <div class = "col-12 text-center">
                                  <a href = ${items[i].info}>
                                    <button class = "btn btn-success">Learn More</button>
                                  </a>
                            </div>
                        </div>
                      <div class = "row  carousel-row">
                            <div class = "col-12 text-center">
                                    <button data-save-book=${items[i].id} data-user-id =${userID}  id = "saveBook${i}" class = "btn btn-primary">Remove from Saved Books</button>
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
    const userID = deleteBook.getAttribute("data-user-id");
    response = await axios.post(`${BASE_URL_USERS}/${userID}/books/delete`, {
      id: bookID,
    });
    deleteBook.innerText = "Book Deleted";
    // console.log(response);
    removeBookHTML(bookID);
  });
}

function removeBookHTML(id) {
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
  //   console.log(resp);
}
