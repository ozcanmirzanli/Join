/* prettier-ignore */
document.addEventListener("DOMContentLoaded", function () {
  let confirmPasswordInput = document.getElementById("confirm-password");
  let emailInput = document.getElementById("email"); 
  let alertUsedEmail = document.querySelector(".used-email");
  let passwordInput = document.getElementById("password")


  loadUsers();


  emailInput.addEventListener("input", function() {
    if (alertUsedEmail.style.display === "block") {
      alertUsedEmail.style.display = "none"; // Hide alert when user modifies email
    }
  });

  passwordInput.addEventListener("input", hideMismatchWarning);
  confirmPasswordInput.addEventListener("input", hideMismatchWarning);

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
let wrongPassword = document.getElementById("alert");

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

let inputChecked = false;

/* prettier-ignore */
async function signUp() {

  if (!inputChecked) {
      alert("Please check the Privacy Policy box to proceed.");
      return;  
  }

  let passwordsMatch = password.value === confirmPasswordInput.value;
  wrongPasswordInput(passwordsMatch, wrongPassword, confirmPasswordContainer); 

  if (!passwordsMatch) {
    return; // Stop the sign-up process if the passwords do not match
  }

  if (usedEmail()) {
    return; // Stop the sign-up process if the email is already used
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
    hideMismatchWarning();
  }
}

function hideMismatchWarning() {
  if (wrongPassword.style.display === "block") {
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

function usedEmail() {
  let emailContainer = document.querySelector(".email-input");
  let alertUsedEmail = document.querySelector(".used-email");
  let emailIsUsed = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email.value) {
      emailIsUsed = true;
      break;
    }
  }

  if (emailIsUsed) {
    emailContainer.style.border = "1px solid red";
    alertUsedEmail.style.display = "block";
    return true;
  } else {
    emailContainer.style.border = "";
    alertUsedEmail.style.display = "none";
    return false;
  }
}

const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");
let signUpBox = document.getElementById("signed-up-success-container");

if (msg) {
  signUpBox.innerHTML = msg;
} else {
  signUpBox.display.style = "none";
}
