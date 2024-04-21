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
