/* prettier-ignore */
document.addEventListener("DOMContentLoaded", function () {
  let confirmPasswordInput = document.getElementById("confirm-password");
  confirmPasswordInput.addEventListener("input", handleConfirmPasswordChange);
  document.getElementById("password").addEventListener("input", confirmPasswordFunction);
  document.getElementById("confirm-password").addEventListener("input", confirmPasswordFunction);
  loadUsers();
  resetRememberMe();
});

let users = [];

let userName = document.getElementById("user-name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let passwordLogo = document.getElementById("password-logo");
let confirmPasswordInput = document.getElementById("confirm-password");
/* prettier-ignore */
let confirmPasswordContainer = document.querySelector(".confirm-password-container");
let confirmPasswordLogo = document.getElementById("confirm-password-logo");
let signUpBtn = document.getElementById("sign-up-btn");
let checked = document.getElementById("checked");
let wrongPassword = document.getElementById("wrong-password");

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
  let inputChecked = checked.style.display === "block";

  if (!inputChecked) {
      alert("Please check the Privacy Policy box to proceed.");
      return;  
  }
      users.push({ userName: userName.value, email: email.value, password: password.value });
      await setItem("users", JSON.stringify(users));

      alert("You have successfully signed up!");
      resetForm();

      window.location.href = "login.html";
  }

function resetForm() {
  userName.value = "";
  email.value = "";
  password.value = "";
  confirmPasswordInput.value = "";
  confirmPasswordLogo.src = "assets/img/lock.png";
  passwordLogo.src = "assets/img/lock.png";

  checkBoxToggle();
}

function confirmPasswordFunction() {
  let passwordsMatch = password.value === confirmPasswordInput.value;

  wrongPasswordInput(passwordsMatch, wrongPassword, confirmPasswordContainer);
  disableSignUpButton(passwordsMatch);
}

/* prettier-ignore */
function wrongPasswordInput(passwordsMatch, wrongPassword, confirmPasswordContainer) {
  if (!passwordsMatch) {
    wrongPassword.style.display = "block";
    confirmPasswordContainer.style.border = "1px solid red";
  } else {
    wrongPassword.style.display = "none";
    confirmPasswordContainer.style.border = "";
  }
}

function disableSignUpButton(passwordsMatch) {
  let isFormValid =
    userName.value && email.value && password.value && passwordsMatch;
  signUpBtn.disabled = !isFormValid;
}

/* prettier-ignore */
function handleConfirmPasswordChange() {

  confirmPasswordLogo.src = confirmPasswordInput.value.length > 0 ? "assets/img/password-hide.png" : "assets/img/lock.png";
}

/* prettier-ignore */
function toggleConfirmPassword() {


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
