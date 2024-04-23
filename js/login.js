let msgBox = document.getElementById("msgBox");
let backgroundFade = document.getElementById("background-fade");

function login() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find(
    (u) => u.email == email.value && u.password == password.value
  );
}

const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");

if (msg) {
  msgBox.innerHTML = msg;
} else {
  msgBox.display.style = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    backgroundFade.style.display = "none";
  }, 1000);
});
