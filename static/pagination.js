var currentPage = 1;
var numberPerPage = 9;
var numberOfPages = 1;

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
  pageResults(items.slice(begin, end));
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
