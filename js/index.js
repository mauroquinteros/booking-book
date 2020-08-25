const $form = document.querySelector("#form");
const $btnSubmit = document.querySelector("#btn-submit");

const BASE_URL = "https://mauroquinteros.github.io/reservar-libro/";
const API_URL = "https://bibliotecaunfv.herokuapp.com";

// Events
$form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  $btnSubmit.disabled = true;
  goToMainPage();
});
$btnSubmit.addEventListener("click", () => {
  $btnSubmit.disabled = true;
  goToMainPage();
});

// Main function
async function goToMainPage() {
  const userCode = document.querySelector("#user-code");
  const validate = validateInput(userCode, "#input-alert");
  if (validate) {
    const { status, data, message } = await getUserById(userCode.value);
    if (status) {
      setLocalStorage(data);
      $btnSubmit.disabled = false;
      window.location.href = `${BASE_URL}/books.html`;
    } else {
      validateInput(userCode, "#input-alert", message);
      $btnSubmit.disabled = false;
    }
  } else {
    $btnSubmit.disabled = false;
  }
}

function validateInput(inputCode, messageSelector, fetchMessage = "") {
  if (inputCode.value === "") {
    stylesAlert(inputCode, messageSelector, "Completa los campos.");
    return false;
  } else if (fetchMessage) {
    stylesAlert(inputCode, messageSelector, fetchMessage);
    return false;
  } else {
    stylesAlert(inputCode, messageSelector);
    return true;
  }
}

function stylesAlert(inputNode, inputSelector, message = "") {
  const messageNode = document.querySelector(inputSelector);
  if (message) {
    messageNode.innerText = message;
    inputNode.classList.add("border-danger");
    inputNode.classList.remove("border-success");
    messageNode.classList.add("text-danger");
  } else {
    inputNode.classList.remove("border-danger");
    messageNode.innerHTML = "";
  }
}

async function getUserById(id) {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function setLocalStorage(data) {
  console.log(data);
  localStorage.setItem("user", JSON.stringify(data));
}
