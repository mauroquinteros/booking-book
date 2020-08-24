const $form = document.querySelector("#form");
const $btnSubmit = document.querySelector("#btn-submit");

const URL = "https://bibliotecaunfv.herokuapp.com";

$form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const userCode = document.querySelector("#user-code");
  const data = await getUserById(userCode.value);
  setLocalStorage(data);
  window.location.href = "http://localhost:5500/libros.html";
});

const getUserById = async (id) => {
  try {
    const response = await fetch(`${URL}/usuarios/${id}`);
    const user = await response.json();
    if (user.status) {
      const { data } = user;
      return data;
    } else {
      const { message } = user;
      return message;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const setLocalStorage = (data) => {
  localStorage.setItem("userCode", JSON.stringify(data));
};
