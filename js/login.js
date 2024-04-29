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

  let email = document.getElementById("email");
  let password = document.getElementById("password");

  let user = users.find(
    (u) => u.email === email.value && u.password === password.value
  );

  if (user) {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("lastLoggedUser", user.userName);
    window.location.href = "summary.html";
  } else {
    document.querySelector(".password-input").style.border = "1px solid red";
    showWrongPassword();
  }
}

function checkBoxToggle() {
  var unchecked = document.getElementById("unchecked");
  var checked = document.getElementById("checked");

  if (unchecked.style.display === "none") {
    unchecked.style.display = "block";
    checked.style.display = "none";
  } else {
    unchecked.style.display = "none";
    checked.style.display = "block";
  }
}

function togglePassword() {
  let passwordInput = document.getElementById("password");
  let passwordLogo = document.getElementById("password-logo");

  if (passwordInput.type === "password" && passwordInput.value.length > 0) {
    passwordLogo.src = "assets/img/password-visible.png";
    passwordInput.type = "text";
  } else if (passwordInput.type === "text" && passwordInput.value.length > 0) {
    passwordLogo.src = "assets/img/password-hide.png";
    passwordInput.type = "password";
  } else {
    passwordLogo.src = "assets/img/lock.png";
  }
}

function showWrongPassword() {
  let wrongPassword = document.getElementById("wrong-password");
  wrongPassword.style.display = "block";
}

function hideWrongPassword() {
  let wrongPassword = document.getElementById("wrong-password");
  wrongPassword.style.display = "none";
}
