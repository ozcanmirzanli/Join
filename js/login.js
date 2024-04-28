/**
 * This function hides the background fade by setting up a timer right after the DOM has been fully loaded.
 *
 */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let backgroundFade = document.getElementById("background-fade");

    backgroundFade.style.display = "none";
  }, 1000);
});

function login(event) {
  event.preventDefault();

  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let passwordInput = document.querySelector(".password-input");
  let wrongPassword = document.getElementById("wrong-password");

  let user = users.find(
    (u) => u.email == email.value && u.password == password.value
  );

  if (user) {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("lastLoggedUser", user.userName);
    window.location.href = "summary.html";
  } else {
    passwordInput.style.border = "1px solid red";
    wrongPassword.style.display = "block";
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
