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
  greetingText.innerText = "";
  greetingTextCondition();
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

changeGreetingText();
