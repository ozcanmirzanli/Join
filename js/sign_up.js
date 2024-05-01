/* prettier-ignore */
document.addEventListener("DOMContentLoaded", function () {
  let confirmPasswordInput = document.getElementById("confirm-password");
  confirmPasswordInput.addEventListener("input", handleConfirmPasswordChange);
  document.getElementById("password").addEventListener("input", confirmPassword);
  document.getElementById("confirm-password").addEventListener("input", confirmPassword);
  loadUsers();
});

let users = [];

let userName = document.getElementById("user-name");
let email = document.getElementById("email");
let password = document.getElementById("password");

async function init() {
  loadUsers();
}

async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/* prettier-ignore */
async function signUp() {
  let signUpBtn = document.getElementById("sign-up-btn");

  signUpBtn.disabled = true;
  let userNameValue = userName.value;

  localStorage.setItem("userName", userNameValue);

  users.push({ userName: userName.value, email: email.value, password: password.value });

  await setItem("users", JSON.stringify(users));
  resetForm();
}

function resetForm() {
  let signUpBtn = document.getElementById("sign-up-btn");

  userName.value = "";
  email.value = "";
  password.value = "";
  signUpBtn.disabled = false;
}

function confirmPassword() {
  let wrongPassword = document.getElementById("wrong-password");
  let confirmPasswordElement = document.getElementById("confirm-password");
  let confirmPasswordInput = document.querySelector(".confirm-password-input");

  let passwordsMatch = password.value === confirmPasswordElement.value;

  wrongPasswordInput(passwordsMatch, wrongPassword, confirmPasswordInput);
  disableSignUpButton(passwordsMatch);
}

/* prettier-ignore */
function wrongPasswordInput(passwordsMatch, wrongPassword, confirmPasswordInput) {
  if (!passwordsMatch) {
    wrongPassword.style.display = "block";
    confirmPasswordInput.style.border = "1px solid red";
  } else {
    wrongPassword.style.display = "none";
    confirmPasswordInput.style.border = "";
  }
}

function disableSignUpButton(passwordsMatch) {
  let signUpBtn = document.getElementById("sign-up-btn");
  let isFormValid = userName.value && passwordsMatch && password.value;

  signUpBtn.disabled = !isFormValid;
}

/* prettier-ignore */
function handleConfirmPasswordChange() {
  let confirmPasswordInput = document.getElementById("confirm-password");
  let confirmPasswordLogo = document.getElementById("confirm-password-logo");

  confirmPasswordLogo.src = confirmPasswordInput.value.length > 0 ? "assets/img/password-hide.png" : "assets/img/lock.png";
}

/* prettier-ignore */
function toggleConfirmPassword() {
  let confirmPasswordInput = document.getElementById("confirm-password");
  let confirmPasswordLogo = document.getElementById("confirm-password-logo");

  let type = confirmPasswordInput.type === "password" ? "text" : "password";
  let src = type === "text" ? "assets/img/password-visible.png" : "assets/img/password-hide.png";

  confirmPasswordInput.type = type;
  confirmPasswordLogo.src = src;
}

const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");
let signUpBox = document.getElementById("signed-up-success-container");

if (msg) {
  signUpBox.innerHTML = msg;
} else {
  signUpBox.display.style = "none";
}
