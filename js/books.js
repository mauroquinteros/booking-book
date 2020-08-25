const $form = document.querySelector("#search-form");
const $listBook = document.querySelector("#list-book");
const $searchButton = document.querySelector("#search-button");

const URL = "https://bibliotecaunfv.herokuapp.com";

document.addEventListener("DOMContentLoaded", () => {
  displayAllBooks();
});

$form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  searchBook();
});

async function searchBook() {
  const { value } = document.querySelector("#search-input");
  addLoader($listBook);
  if (value === "") {
    displayAllBooks();
  } else {
    displayOneBook(value);
  }
}

function addLoader($container) {
  $container.classList.add("loading");
  const $loader = document.createElement("div");
  $loader.classList.add("load");
  $loader.innerHTML = `
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  `;
  $container.appendChild($loader);
}

function removeLoader($container) {
  $listBook.querySelectorAll("*").forEach((node) => node.remove());
  $container.classList.remove("loading");
}

async function displayAllBooks() {
  const { status, data } = await getAllBooks();
  if (status) {
    removeLoader($listBook);
    data.forEach((book) => {
      const $bookItem = createItemBook(book);
      $listBook.appendChild($bookItem);
    });
    const $btnBookings = $listBook.querySelectorAll(
      ".book-item > .book-item-button"
    );
    addBookEvent($btnBookings);
  }
}

async function displayOneBook(titleBook) {
  const { status, data } = await getBookByTitle(titleBook);
  if (status) {
    removeLoader($listBook);
    const bookItem = createItemBook(data);
    $listBook.appendChild(bookItem);
  }
}

function createItemBook({ titulo, autor, editorial, categoria, img, id }) {
  const bookItem = document.createElement("li");
  bookItem.classList.add("book-item");
  bookItem.dataset.id = id;
  bookItem.innerHTML = `
    <h4 class="book-item-title">${titulo}</h4>
    <div class="book-item-description">
      <img class="book-item-image" src=${img} alt=${titulo}>
      <div class="book-item-info">
        <p>Autor:</p>
        <p>${autor}</p>
        <p>Categoría:</p>
        <p>${categoria}</p>
        <p>Editorial:</p>
        <p>${editorial}</p>
      </div>
    </div>
    <button class="book-item-button">Reservar</button>
  `;
  return bookItem;
}

async function getBookByTitle(title) {
  try {
    const response = await fetch(`${URL}/libros/?titulo=${title}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllBooks() {
  try {
    const response = await fetch(`${URL}/libros`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

function getUserId() {
  if (localStorage.getItem("user")) {
    const { id } = JSON.parse(localStorage.getItem("user"));
    return id;
  }
}

function addBookEvent(bookingButtons) {
  bookingButtons.forEach((button) => {
    button.onclick = bookingEvent;
  });
}

async function bookingEvent({ target: { parentNode } }) {
  const idBook = parentNode.dataset.id;
  const idUser = getUserId();
  const booking = {
    id_usuario: idUser,
    id_libro: idBook,
  };
  await makeBooking(booking);
  addAlert();
}

async function makeBooking(booking) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    };
    const response = await fetch(`${URL}/reserva`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

function addAlert() {
  swal({
    title: "Reserva registrada exitosamente! 🥳",
    text: `Fecha de la reserva: ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
    icon: "success",
  });
}
