const $form = document.querySelector("#search-form");
const $listBook = document.querySelector("#list-book");
const $btnSubmit = document.querySelector("#btn-submit");

const URL = "https://bibliotecaunfv.herokuapp.com";

$form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const titleBook = document.querySelector("#search-input");

  $listBook.querySelectorAll("*").forEach((node) => node.remove());
  const loading = document.createElement("p");
  loading.innerText = "...Loading";
  $listBook.appendChild(loading);

  const { status, data } = await getBookByTitle(titleBook.value);
  $listBook.querySelectorAll("*").forEach((node) => node.remove());
  const bookItem = createItemBook(data);
  $listBook.appendChild(bookItem);
  console.log(status, data);
});

document.addEventListener("DOMContentLoaded", async () => {
  await getAllBooks();
});

const getBookByTitle = async (title) => {
  try {
    const response = await fetch(`${URL}/libros/?titulo=${title}`);
    const data = await response.json();
    return data;
  } catch (error) {}
};

const getAllBooks = async () => {
  try {
    const response = await fetch(`${URL}/libros`);
    const { status, data } = await response.json();
    console.log(data);

    if (status) {
      $listBook.querySelectorAll("*").forEach((node) => node.remove());
      data.forEach((book) => {
        const bookItem = createItemBook(book);
        $listBook.appendChild(bookItem);
      });
      // Obtener los botones de reservar
      const reservaButtons = $listBook.querySelectorAll(
        ".book-item > .book-item-button"
      );
      reservarEvent(reservaButtons);
    }
  } catch (error) {
    console.log(error);
  }
};

const createItemBook = ({ titulo, autor, editorial, categoria, img, id }) => {
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
      </div>
    </div>
    <button class="book-item-button">Reservar</button>
  `;
  return bookItem;
};

const reservarEvent = (reservaButtons) => {
  reservaButtons.forEach((button) => {
    button.onclick = reservar;
  });
};

const reservar = async (ev) => {
  console.log("click");
  const idBook = ev.target.parentNode.dataset.id;
  const idUser = getInfo();
  const reserva = {
    id_usuario: idUser,
    id_libro: idBook,
  };
  console.log(reserva);
  const data = await realizarReserva(reserva);
  console.log(data);
  addAlert(data, ev.target.parentNode);
};

const getInfo = () => {
  if (localStorage.getItem("userCode")) {
    const { id } = JSON.parse(localStorage.getItem("userCode"));
    return id;
  }
};

const realizarReserva = async (reserva) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reserva),
  };
  const response = await fetch(`${URL}/reserva`, options);
  const data = await response.json();
  return data;
};

const addAlert = (data, parentNode) => {
  swal({
    title: "Reserva registrada exitosamente! 🥳",
    text: `${new Date()}`,
    icon: "success",
  }).then(() => console.log("reserva exitosa"));
};
