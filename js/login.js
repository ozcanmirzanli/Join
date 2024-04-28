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

function login() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  let user = users.find(
    (u) => u.email == email.value && u.password == password.value
  );
}

const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");
let msgBox = document.getElementById("msgBox");

if (msg) {
  msgBox.innerHTML = msg;
} else {
  msgBox.display.style = "none";
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
