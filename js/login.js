/**
 * Event listener for the DOMContentLoaded event.
 * This event listener checks if the element with ID 'login-logo' is present in the DOM.
 * If the element is found, it calls the changeLogoToMobile function.
 * If the element is not found, it logs a warning message to the console.
 *
 * @param {Event} event - The DOMContentLoaded event object.
 */
document.addEventListener("DOMContentLoaded", (event) => {
  if (document.getElementById("login-logo")) {
    changeLogoToMobile();
  }
});

/**
 * Sets up the DOMContentLoaded event to hide the background fade after a set timeout.
 */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let backgroundFade = document.getElementById("background-fade");
    if (backgroundFade) {
      backgroundFade.style.display = "none";
    }
  }, 1000);
});

checkRememberMe();
changeLogoToMobile();

/**
 * Authenticates a user based on email and password, and handles the login process.
 */
async function login(event) {
  event.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  let users = await getItem("/users");

  if (!Array.isArray(users)) {
    users = [];
  }

  let user = validateUser(users, email, password);

  if (user) {
    loginUser(user);
  } else {
    showWrongPassword();
  }
}

/**
 * Validates user credentials with the given credentials.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 */
function validateUser(users, email, password) {
  for (const user of users) {
    console.log(`Checking email: ${user.email} against input: ${email}`);
    console.log(
      `Checking password: ${user.password} against input: ${password}`
    );

    if (
      user.email.trim().toLowerCase() === email.toLowerCase() &&
      user.password === password
    ) {
      console.log("User found:", user);
      return user;
    }
  }
  console.log("No matching user found.");
  return null;
}

/**
 * Sets user information in session storage and manages "Remember Me" data.
 * @param {Object} user - The user object to login.
 */
async function loginUser(user) {
  sessionStorage.setItem('currentUser', JSON.stringify(user));

  let checked = document.getElementById("checked");
  if (!checked.classList.contains("d-none")) {
    await setItem("rememberMeEmail", user.email);
    await setItem("rememberMePassword", user.password);
  } else {
    await setItem("rememberMeEmail", "");
    await setItem("rememberMePassword", "");
  }

  window.location.href = "summary.html";
}

/**
 * Clears user session and user data upon logout.
 */
async function logoutUser() {
  sessionStorage.removeItem("currentUser");
  await resetUser();

  window.location.href = "login.html";
}

/**
 * Resets the remembered user data to defaults.
 */
async function resetUser() {
  await setItem("rememberMeEmail", "");
  await setItem("rememberMePassword", "");
}

/**
 * Handles the login for a guest user.
 */
function guestLogin() {
  let guestUser = {
    userName: "guest",
    email: "guest@guest.de",
    password: "guest",
  };

  sessionStorage.setItem("currentUser", JSON.stringify(guestUser));
  window.location.href = "summary.html";
}

/**
 * Handles focus event on input elements by setting a custom border color.
 */
function handleFocus(event) {
  if (event.target.tagName === "INPUT") {
    event.target.parentElement.style.border = "1px solid #29ABE2";
  }
}

/**
 * Handles blur event on input elements by resetting the border color.
 */
function handleBlur(event) {
  if (event.target.tagName === "INPUT") {
    event.target.parentElement.style.border = "";
  }
}

/**
 * Toggles the checked state of the checkbox and handles related UI changes.
 */
function checkBoxToggle() {
  let checked = document.getElementById("checked");

  if (checked.classList.contains("d-none")) {
    checkedFunc();
    checkRememberMeState(true);
    inputChecked = true;
  } else {
    uncheckedFunc();
    checkRememberMeState(false);
    inputChecked = false;
  }
}

/**
 * Updates the checked state of "Remember Me" in local storage.
 * @param {boolean} isChecked - Whether the "Remember Me" is checked.
 */
function checkRememberMeState(isChecked) {
  localStorage.setItem("rememberMeChecked", isChecked);
}

/**
 * Retrieves the "Remember Me" checked state from local storage.
 * @returns {boolean} True if "Remember Me" is checked, otherwise false.
 */
function getRememberMeState() {
  return localStorage.getItem("rememberMeChecked") === "true";
}

/* prettier-ignore */
/**
 * Checks for remembered user credentials and updates the login form accordingly.
 */
async function checkRememberMe() {
  let loginPage = document.querySelector(".login-page")
  let rememberedEmail = await getItem("rememberMeEmail");
  let rememberedPassword = await getItem("rememberMePassword");
  let isChecked = getRememberMeState();

  if (isChecked && rememberedEmail && rememberedPassword && loginPage) {
    fillLoginForm(rememberedEmail, rememberedPassword)
  } else {
    clearInputFields()
  }
}

/**
 * Fills the login form fields with remembered credentials and adjusts the UI
 * @param {string} rememberedEmail - The email address that is remembered in the email input field.
 * @param {string} rememberedPassword - The password that is remembered in the password input field.
 */
function fillLoginForm(rememberedEmail, rememberedPassword) {
  document.getElementById("email").value = rememberedEmail;
  document.getElementById("password").value = rememberedPassword;
  checkedFunc();
}

/**
 * Clears the remembered credentials.
 */
async function unCheckRememberMe() {
  await resetUser();
  clearInputFields();
  uncheckedFunc();
}

/**
 * Helper function to indicate a checked state in the UI.
 */
function checkedFunc() {
  const checked = document.getElementById("checked");
  const unchecked = document.getElementById("unchecked");
  if (checked) {
    checked.classList.remove("d-none");
  }
  if (unchecked) {
    unchecked.classList.add("d-none");
  }
}

/**
 * Helper function to indicate an unchecked state in the UI.
 */
function uncheckedFunc() {
  const checked = document.getElementById("checked");
  const unchecked = document.getElementById("unchecked");
  if (checked) {
    checked.classList.add("d-none");
  }
  if (unchecked) {
    unchecked.classList.remove("d-none");
  }
}

/**
 * Helper function to clear input fields in the form.
 */

function clearInputFields() {
  const emailElement = document.getElementById("email");
  const passwordElement = document.getElementById("password");

  if (emailElement) {
    emailElement.value = "";
  }

  if (passwordElement) {
    passwordElement.value = "";
  }

  uncheckedFunc();
}

/**
 * Handles changes to the password field by updating the password logo based on input presence.
 */
function handlePasswordChange() {
  let passwordInput = document.getElementById("password");
  let passwordLogo = document.getElementById("password-logo");

  passwordLogo.src =
    passwordInput.value.length > 0
      ? "assets/img/password-hide.png"
      : "assets/img/lock.png";
}

/**
 * Toggles the visibility of the password in the input field.
 */
function togglePassword() {
  let passwordInput = document.getElementById("password");
  togglePasswordVisibility(passwordInput);
  updatePasswordLogo(passwordInput);
}

/**
 * Toggles the visibility attribute of the password input field.
 */
function togglePasswordVisibility(passwordInput) {
  if (passwordInput.type === "password" && passwordInput.value.length > 0) {
    passwordInput.type = "text";
  } else if (passwordInput.type === "text" && passwordInput.value.length > 0) {
    passwordInput.type = "password";
  }
}

/**
 * Updates the visual icon for the password field based on its current state (visible or hidden).
 */
function updatePasswordLogo(passwordInput) {
  let passwordLogo = document.getElementById("password-logo");

  if (passwordInput.type === "text") {
    passwordLogo.src = "assets/img/password-visible.png";
  } else if (
    passwordInput.type === "password" &&
    passwordInput.value.length > 0
  ) {
    passwordLogo.src = "assets/img/password-hide.png";
  } else {
    passwordLogo.src = "assets/img/lock.png";
  }
}

/**
 * Displays an error message and updates UI for wrong password entry.
 */
function showWrongPassword() {
  let wrongPassword = document.getElementById("wrong-password");
  wrongPassword.style.display = "block";
  document.querySelector(".password-input").style.border = "1px solid red";
}

/**
 * Hides the error message for wrong password entry.
 */
function hideWrongPassword() {
  let wrongPassword = document.getElementById("wrong-password");
  wrongPassword.style.display = "none";
}

/**
 * Changes the logo if the screen width is lower than 600px
 * sets a timeout to change it back so it fits with the animation
 */
function changeLogoToMobile() {
  let loginLogo = document.getElementById("login-logo");
  if (!loginLogo) {
    return;
  }
  if (window.innerWidth < 601) {
    loginLogo.src = "assets/img/mobile-logo.png";
    setTimeout(function () {
      loginLogo.src = "assets/img/Capa_1.png";
    }, 1000);
  }
}
