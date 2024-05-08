/**
 * This function is executed once all the DOM content is fully loaded.
 * 1. Waits for 2.9 seconds before hiding the load animation for smaller screens (under 900px width).
 * 2. Calls functions `changeGreetingText` and `updateSummary` to update the page's content.
 */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let welcomeBackground = document.querySelector(".welcome-backgound");
    let welcomeText = document.querySelector(".welcome-text");
    if (window.innerWidth < 900) {
      welcomeBackground.style.display = "none";
      welcomeText.style.display = "none";
    }
  }, 2900);

  changeGreetingText();
  updateSummary();
});

let userNameSummary = document.getElementById("user-name");
let greetingText = document.getElementById("greeting-text");

/**
 * Adds click event listeners to elements with class "first-row".
 */
document.querySelectorAll(".first-row").forEach(function (element) {
  element.addEventListener("click", openBoard);
});

/**
 * Adds a click event listener to the element with class "second-row".
 */
document.querySelector(".second-row").addEventListener("click", openBoard);

/**
 * Adds click event listeners to elements with class "third-row".
 */
document.querySelectorAll(".third-row").forEach(function (element) {
  element.addEventListener("click", openBoard);
});

/**
 * Gets the current user's information from sessionStorage.
 * @returns {Object|null} The current user object or null if no user is stored.
 */
function getCurrentUser() {
  const userName = JSON.parse(sessionStorage.getItem("currentUser"));
  if (userName) {
    return userName;
  }
  return null;
}

/**
 * Changes the source image of buttons to a highlighted version.
 * @param {Element} element - The element containing the button image.
 */
function changeButtonColor(element) {
  if (window.innerWidth > 800) {
    let img = element.querySelector("img");
    if (img.id === "to-do-btn") {
      img.src = "assets/img/pencil-btn-white.png";
    } else if (img.id === "done-btn") {
      img.src = "assets/img/done-white.png";
    }
  }
}

/**
 * Resets the source image of buttons to their original version.
 * @param {Element} element - The element containing the button image.
 */
function resetButtonColor(element) {
  if (window.innerWidth > 800) {
    let img = element.querySelector("img");
    if (img.id === "to-do-btn") {
      img.src = "assets/img/pencil_toDo_Summary.svg";
    } else if (img.id === "done-btn") {
      img.src = "assets/img/hook_done_Summary.svg";
    }
  }
}

let today = new Date();
let curHr = today.getHours();

/**
 * Updates the greeting text based on the current time and user's first name.
 */
function changeGreetingText() {
  const currentUser = getCurrentUser();
  greetingText.innerText = "";
  greetingTextCondition();

  userNameSummary.innerText = "";
  if (currentUser) {
    userNameSummary.innerText =
      currentUser.userName[0].toUpperCase() + currentUser.userName.slice(1);
  }
}

/**
 * Sets greeting text based on the current hour of the day.
 */
function greetingTextCondition() {
  if (curHr < 12) {
    greetingText.innerText = "Good morning,";
  } else if (curHr < 18) {
    greetingText.innerText = "Good afternoon,";
  } else {
    greetingText.innerText = "Good evening,";
  }
}

/**
 * Updates the display of various task categories.
 */
function updateSummary() {
  updateDisplay("to-do", todos.length);
  updateDisplay("done", getCategoryCount("done"));
  updateDisplay("urgent", getCategoryCount("urgent"));
  updateDisplay("in-board", getCategoryCount("inBoard"));
  updateDisplay("in-progress", getCategoryCount("inProgress"));
  updateDisplay("awaiting-feedback", getCategoryCount("awaitingFeedback"));
}

/**
 * Returns the count of tasks in a specified category.
 * @param {string} category - The category of tasks to count.
 * @returns {number} The number of tasks in the category.
 */
function getCategoryCount(category) {
  return todos.filter((todo) => todo.category === category).length;
}

/**
 * Updates the text content of an element with a specified count.
 * @param {string} elementId - The ID of the element to update.
 * @param {number} count - The count to display in the element.
 */
function updateDisplay(elementId, count) {
  let displayElement = document.getElementById(elementId);
  displayElement.innerText = `${count}`;
}

/**
 * Redirects the browser to the board.html page.
 */
function openBoard() {
  window.location.href = "board.html";
}
