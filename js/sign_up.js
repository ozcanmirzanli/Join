let userName = document.getElementById("user-name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let passwordLogo = document.getElementById("password-logo");
/* prettier-ignore */
let confirmPasswordContainer = document.querySelector(".confirm-password-container");
let confirmPasswordLogo = document.getElementById("confirm-password-logo");
let signUpBtn = document.getElementById("sign-up-btn");
let checked = document.getElementById("checked");
let wrongPassword = document.getElementById("alert");
let confirmPasswordInput = document.getElementById("confirm-password");
let emailInput = document.getElementById("email");
let emailContainer = document.querySelector(".email-input");
let alertUsedEmail = document.querySelector(".used-email");

loadUsers();

/**
 * Initializes the application by loading user data from storage.
 * @async
 */
async function init() {
  loadUsers();
}

/**
 * Loads user data from local storage and parses it into the 'users' array.
 * If the data cannot be loaded or parsed, an error is logged to the console.
 * @async
 */
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

let inputChecked = false;

/* prettier-ignore */
/**
 * Initiates the sign-up process for a new user. It first checks if the privacy policy has been agreed to,
 * then it validates if the passwords entered match and finally checks if the email is already in use.
 * If all conditions are met, it proceeds to register the user.
 */
async function signUp() {
  if (!inputChecked) {
      alert("Please check the Privacy Policy box to proceed.");
      return;  
  }

  let passwordsMatch = password.value === confirmPasswordInput.value;
  wrongPasswordInput(passwordsMatch); 

  if (!passwordsMatch) {
    return; // Stop the sign-up process if the passwords do not match
  }

  if (updateEmailUI()) {
    return; // Stop the sign-up process if the email is already used
}
  signUpProccess() 
  }

/* prettier-ignore */
/**
 * Processes the registration of the user by adding their information to the storage
 * and handling registration tasks slike showing a success message and resetting the form.
 */
async function signUpProccess() {
users.push({ userName: userName.value, email: email.value, password: password.value });
  await setItem("users", JSON.stringify(users));
  showSignedUpSuccess();
  resetForm();
}

/**
 * Resets the sign-up form fields and visuals to their default states.
 */
function resetForm() {
  userName.value = "";
  email.value = "";
  password.value = "";
  confirmPasswordInput.value = "";
  confirmPasswordLogo.src = "assets/img/lock.png";
  passwordLogo.src = "assets/img/lock.png";

  checkBoxToggle();
}

/**
 * Displays a success message and redirects the user after a short delay.
 * The success message is shown for a set duration before transitioning the user to the login page.
 */
function showSignedUpSuccess() {
  let successContainer = document.querySelector(".signed-up-success-container");
  successContainer.style.display = "block";

  setTimeout(() => {
    successContainer.style.display = "flex";
    window.location.href = "login.html";
  }, 1200);
}

/**
 * This function checks if the password and the confirm password are matching
 */
function confirmPasswordFunction() {
  let passwordsMatch = password.value === confirmPasswordInput.value;

  wrongPasswordInput(passwordsMatch);
  disableSignUpButton(passwordsMatch);

  // Adds an event listener to the confirm password input field to handle changes in the confirmation password
  confirmPasswordInput.addEventListener("input", handleConfirmPasswordChange);
}

/* prettier-ignore */

/**
 * Checks if the passwords in the 'password' and 'confirm password' fields match.
 * Updates UI based on whether they match.
 * @param {boolean} passwordsMatch - Whether the password and confirm password inputs match.
 */
function wrongPasswordInput(passwordsMatch) {
  if (!passwordsMatch) {
    showMismatchWarning();
  } else {
    hideMismatchWarning();
  }

  // Adds an event listener to the password input field to hide the password mismatch warning when the user modifies the password
password.addEventListener("input", hideMismatchWarning);

// Adds an event listener to the confirm password input field to hide the password mismatch warning when the user modifies the confirmation password
confirmPasswordInput.addEventListener("input", hideMismatchWarning);
}

/**
 * Displays an error message and styles if the passwords do not match.
 */
function showMismatchWarning() {
  wrongPassword.style.display = "block";
  confirmPasswordContainer.style.border = "1px solid red";

  /* prettier-ignore */
  // Event listener to hide alert message for used email when the user starts typing in the email input field
  emailInput.addEventListener("input", () => (alertUsedEmail.style.display = "none"));
}

/**
 * Hides the error message and resets styles related to password mismatch.
 */
function hideMismatchWarning() {
  if (wrongPassword.style.display === "block") {
    wrongPassword.style.display = "none";
    confirmPasswordContainer.style.border = "";
  }
}

/**
 * Enables or disables the sign-up button based on form validity.
 * The button is enabled only if all fields are filled and passwords match.
 * @param {boolean} passwordsMatch - Whether the password and confirm password inputs match.
 */
function disableSignUpButton(passwordsMatch) {
  let isFormValid =
    userName.value && email.value && password.value && passwordsMatch;
  signUpBtn.disabled = !isFormValid;
}

/* prettier-ignore */
/**
 * Updates the visibility icon of the confirm password input based on its content.
 * Changes the icon to indicate whether the field is empty or contains text.
 */
function handleConfirmPasswordChange() {
  confirmPasswordLogo.src = confirmPasswordInput.value.length > 0 ? "assets/img/password-hide.png" : "assets/img/lock.png";
}

/* prettier-ignore */
/**
 * This function changes the password logo depending on the input type
 */
function toggleConfirmPassword() {
  let type = confirmPasswordInput.type === "password" ? "text" : "password";
  let src = type === "text" ? "assets/img/password-visible.png" : "assets/img/password-hide.png";

  confirmPasswordInput.type = type;
  confirmPasswordLogo.src = src;
}

/**
 * Checks if the given email is already used by any previous user.
 * @returns {boolean} Returns true if the email is already used, otherwise false.
 */
function isEmailUsed() {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email.value) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if the entered email is already in use and updates the UI accordingly.
 * If the email is used, it displays a warning.
 * Otherwise, it resets the UI to its default state.
 * @returns {boolean} Returns true if the email is already used, otherwise false.
 */
function updateEmailUI() {
  let emailIsUsed = isEmailUsed();

  if (emailIsUsed) {
    usedEmailUI();
  } else {
    defaultEmailUI();
  }
  return emailIsUsed;
}

/**
 * Updates the UI to reflect that the email is already in use.
 * It changes the border color of the email input container to red and makes a warning message visible.
 */
function usedEmailUI() {
  emailContainer.style.border = "1px solid red";
  alertUsedEmail.style.display = "block";
}

/**
 * Resets the email input UI to its default state.
 * It removes the border styling from the email input container and hides the warning message.
 */
function defaultEmailUI() {
  emailContainer.style.border = "";
  alertUsedEmail.style.display = "none";
}
