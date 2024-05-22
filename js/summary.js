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
  loadtaskData().then(updateSummary);
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

let taskData = [];

async function loadtaskData() {
  try {
    const loadedtaskData = JSON.parse(await getItem("taskData")) || [];
    taskData = loadedtaskData;
  } catch (e) {
    console.error("Could not load tasks", e);
  }
}

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
 * Updates the summary display with counts of tasks by their status and priority.
 */
function updateSummary() {
  let toDo = countTasksByStatus("toDo");
  let inProgress = countTasksByStatus("inProgress");
  let done = countTasksByStatus("done");
  let urgent = countTasksByPriority("Urgent");
  let inBoard = taskData.length;
  let awaitFeedback = countTasksByStatus("awaitFeedback");

  updateDisplay("to-do", toDo);
  updateDisplay("done", done);
  updateDisplay("urgent", urgent);
  updateDisplay("in-board", inBoard);
  updateDisplay("in-progress", inProgress);
  updateDisplay("awaiting-feedback", awaitFeedback);
  setDueDateDisplay("due-date");
}

/**
 * Counts the number of tasks with a specific status.
 *
 * @param {string} status - The status of the tasks to count (e.g., "toDo", "inProgress").
 * @returns {number} The number of tasks with the specified status.
 */
function countTasksByStatus(status) {
  return taskData.filter((task) => task.todo === status).length;
}

/**
 * Counts the number of tasks with a specific priority.
 *
 * @param {string} priority - The priority of the tasks to count (e.g., "Urgent").
 * @returns {number} The number of tasks with the specified priority.
 */
function countTasksByPriority(priority) {
  return taskData.filter((task) => task.priority === priority).length;
}

/**
 * Sets the due date display for a specific task.
 * @param {string} elementId - The ID of the element to update with the due date.
 */
function setDueDateDisplay(elementId) {
  let closestDueDateTask = findClosestDueDateTask(getUrgentTasksWithDueDates());

  if (closestDueDateTask) {
    let displayElement = document.getElementById(elementId);
    displayElement.innerText = formatDate(new Date(closestDueDateTask.dueDate));
  }
}

/**
 * Retrieves tasks with "Urgent" priority and due dates.
 * @returns {Array} An array of tasks with "Urgent" priority and due dates.
 */
function getUrgentTasksWithDueDates() {
  return taskData.filter((task) => task.priority === "Urgent" && task.dueDate);
}

/**
 * Finds the task with the closest due date among the provided tasks.
 * @param {Array} tasks - An array of tasks with due dates.
 * @returns {Object|null} The task object with the closest due date or null if no tasks are provided.
 */
function findClosestDueDateTask(tasks) {
  if (tasks.length === 0) return null;

  let currentDate = new Date();
  let closestTask = tasks[0];
  let closestDifference = Math.abs(currentDate - new Date(closestTask.dueDate));

  for (let i = 1; i < tasks.length; i++) {
    let difference = Math.abs(currentDate - new Date(tasks[i].dueDate));
    if (difference < closestDifference) {
      closestTask = tasks[i];
      closestDifference = difference;
    }
  }

  return closestTask;
}

/**
 * Formats the date to a textual representation.
 *
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let dd = date.getDate();
  let mm = date.getMonth();
  let yyyy = date.getFullYear();

  return monthNames[mm] + " " + (dd < 10 ? "0" + dd : dd) + ", " + yyyy;
}

/**
 * Returns the count of tasks in a specified category.
 * @param {string} category - The category of tasks to count.
 * @returns {number} The number of tasks in the category.
 */

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
