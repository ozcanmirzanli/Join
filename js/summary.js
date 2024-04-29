document.addEventListener("DOMContentLoaded", function () {
  changeGreetingText();
  updateSummary();
});

function getCurrentUser() {
  const userName = JSON.parse(sessionStorage.getItem("currentUser"));
  if (userName) {
    return userName;
  }
  return null;
}

let userNameSummary = document.getElementById("user-name");
let greetingText = document.getElementById("greeting-text");

function changeButtonColor(element) {
  let img = element.querySelector("img");

  if (img.id === "to-do-btn") {
    img.src = "assets/img/pencil-btn-white.png";
  } else if (img.id === "done-btn") {
    img.src = "assets/img/done-white.png";
  }
}

function resetButtonColor(element) {
  let img = element.querySelector("img");

  if (img.id === "to-do-btn") {
    img.src = "assets/img/pencil_toDo_Summary.svg";
  } else if (img.id === "done-btn") {
    img.src = "assets/img/hook_done_Summary.svg";
  }
}

let today = new Date();
let curHr = today.getHours();

function changeGreetingText() {
  const currentUser = getCurrentUser();
  greetingText.innerText = "";
  greetingTextCondition();

  userNameSummary.innerText = "";
  if (currentUser) {
    userNameSummary.innerText = currentUser.userName;
  } else {
    userNameSummary.innerText = "Guest";
  }
}

function greetingTextCondition() {
  if (curHr < 12) {
    greetingText.innerText = "Good morning,";
  } else if (curHr < 18) {
    greetingText.innerText = "Good afternoon,";
  } else {
    greetingText.innerText = "Good evening,";
  }
}

function updateSummary() {
  let todoDisplay = document.getElementById("to-do");
  let doneDisplay = document.getElementById("done");

  let done = todos.filter((t) => t["category"] == "done"); //Filter Array nach category: done

  todoDisplay.innerText = `${todos.length}`;
  doneDisplay.innerText = `${done.length}`;
}

changeGreetingText();
