/**
 * This function hides the background fade by setting up a timer right after the DOM has been fully loaded.
 *
 */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let backgroundFade = document.getElementById("background-fade");
    backgroundFade.style.display = "none";
  }, 1000);

  // Attach event handlers to the form for focusin and focusout events
  document.querySelector(".inputs").addEventListener("focusin", handleFocus);
  document.querySelector(".inputs").addEventListener("focusout", handleBlur);

  // Hide wrong password text when the input value changes
  let passwordInput = document.getElementById("password");
  passwordInput.addEventListener("input", hideWrongPassword);
  // Changes the password logo to default when the input field is empty
  passwordInput.addEventListener("input", handlePasswordChange);
  checkRememberMe();
});

function handleFocus(event) {
  if (event.target.tagName === "INPUT") {
    event.target.parentElement.style.border = "1px solid #29ABE2";
  }
}

function handleBlur(event) {
  if (event.target.tagName === "INPUT") {
    event.target.parentElement.style.border = "";
  }
}

function login(event) {
  event.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  let user = validateUser(email, password);

  if (user) {
    loginUser(user);
  } else {
    showWrongPassword();
  }
}

function validateUser(email, password) {
  return users.find((u) => u.email.trim() === email && u.password === password);
}

async function loginUser(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));

  let checked = document.getElementById("checked");
  if (!checked.classList.contains("d-none")) {
    // Store the user email in remote storage for "Remember Me" functionality
    await setItem("rememberMeEmail", user.email);
    await setItem("rememberMePassword", user.password);
  }

  window.location.href = "summary.html";
}

async function logoutUser() {
  sessionStorage.removeItem("currentUser");
  // Clear the remembered user's data
  await setItem("rememberMeEmail", "");
  await setItem("rememberMePassword", "");

  window.location.href = "login.html";
}

function checkBoxToggle() {
  let unchecked = document.getElementById("unchecked");
  let checked = document.getElementById("checked");

  if (checked.classList.contains("d-none")) {
    checked.classList.remove("d-none");
    unchecked.classList.add("d-none");
  } else {
    checked.classList.add("d-none");
    unchecked.classList.remove("d-none");
  }
}

async function checkRememberMe() {
  let rememberedEmail = await getItem("rememberMeEmail");
  let rememberedPassword = await getItem("rememberMePassword");

  if (rememberedEmail && document.querySelector(".login-page")) {
    document.getElementById("email").value = rememberedEmail;
    document.getElementById("password").value = rememberedPassword;

    // Automatically check the 'Remember Me' box
    document.getElementById("checked").classList.remove("d-none");
    document.getElementById("unchecked").classList.add("d-none");
  }
}

/* prettier-ignore */
function handlePasswordChange() {
  let passwordInput = document.getElementById("password");
  let passwordLogo = document.getElementById("password-logo");

  passwordLogo.src = passwordInput.value.length > 0 ? "assets/img/password-hide.png" : "assets/img/lock.png";
}

function togglePassword() {
  let passwordInput = document.getElementById("password");
  togglePasswordVisibility(passwordInput);
  updatePasswordLogo(passwordInput);
}

function togglePasswordVisibility(passwordInput) {
  if (passwordInput.type === "password" && passwordInput.value.length > 0) {
    passwordInput.type = "text";
  } else if (passwordInput.type === "text" && passwordInput.value.length > 0) {
    passwordInput.type = "password";
  }
}

/* prettier-ignore */
function updatePasswordLogo(passwordInput) {
  let passwordLogo = document.getElementById("password-logo");

  if (passwordInput.type === "text") {
    passwordLogo.src = "assets/img/password-visible.png";
  } else if (passwordInput.type === "password" && passwordInput.value.length > 0) {
    passwordLogo.src = "assets/img/password-hide.png";
  } else {
    passwordLogo.src = "assets/img/lock.png";
  }
}

function showWrongPassword() {
  let wrongPassword = document.getElementById("wrong-password");
  wrongPassword.style.display = "block";
  document.querySelector(".password-input").style.border = "1px solid red";
}

function hideWrongPassword() {
  let wrongPassword = document.getElementById("wrong-password");
  wrongPassword.style.display = "none";
}
