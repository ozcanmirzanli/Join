document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let backgroundFade = document.getElementById("background-fade");
    backgroundFade.style.display = "none";
  }, 1000);

  // Attach event handlers to the form for focusin and focusout events
  document.querySelector(".inputs").addEventListener("focusin", handleFocus);
  document.querySelector(".inputs").addEventListener("focusout", handleBlur);
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
  let unchecked = document.getElementById("unchecked");
  let checked = document.getElementById("checked");
  [unchecked, checked].forEach(
    (el) => (el.style.display = el.style.display === "none" ? "block" : "none")
  );
}

function togglePassword() {
  var passwordInput = document.getElementById("password");
  var passwordLogo = document.getElementById("password-logo");

  if (passwordInput.type === "password") {
    passwordLogo.src = "assets/img/password-visible.png";
    passwordInput.type = "text";
  } else {
    passwordLogo.src = "assets/img/password-hide.png";
    passwordInput.type = "password";
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
