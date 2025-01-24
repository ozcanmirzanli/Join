/**
 * Event listener for the DOMContentLoaded event.
 * This event listener initializes various functions and behaviors after the DOM content is loaded.
 *
 * @param {Event} event - The DOMContentLoaded event object.
 */
document.addEventListener("DOMContentLoaded", async (event) => {
  await includeHTML();
  await new Promise((resolve) => {
    window.onload = resolve;
  });
  if (document.getElementById("toDo")) {
    await initBoard();
  }
  const plusMobile = document.getElementById("plusMobile");
  const addTaskBtns = document.querySelectorAll(".plus, #addTaskBtn");
  if (plusMobile && addTaskBtns.length > 0) {
    adjustOnClickBehavior();
  }
});

/**
 * Initializes the task board by loading task data and updating the HTML board.
 * This function is asynchronous and waits for the task data to be loaded before updating the board.
 */
async function initBoard() {
  await loadTasksDataBoard();
  await getContactBoard();
  updateHTMLBoard();
}

/**
 * Initializes the task board by loading task data and updating the HTML board.
 * This function is asynchronous and waits for the task data to be loaded before updating the board.
 */
function updateHTMLBoard() {
  try {
    updateTodo();
    updateInProgress();
    updateAwaitFeedback();
    updateDone();
  } catch (error) {
    console.error("Fehler in updateHTMLBoard:", error);
  }
}

/**
 * Loads the task data from storage and parses it into the `taskData` variable.
 * This function is asynchronous and uses a try-catch block to handle potential errors during data loading.
 */
async function loadTasksDataBoard() {
  try {
    taskData = await getItem("taskData");
  } catch (e) {
    console.info("Could not load tasks");
  }
}

/**
 * Fetches the contact list from storage and assigns it to the `contacts` variable.
 * Logs an info message if the contacts could not be loaded.
 *
 * @returns {Promise<void>} - A promise that resolves when the contacts are loaded.
 */
async function getContactBoard() {
  try {
    contacts = await getItem("contacts");
  } catch (error) {
    console.info("Could not load contacts");
  }
}

/**
 * Updates the "To Do" column with tasks that have the status "toDo".
 * If there are no tasks, displays a message indicating no tasks are available.
 */
function updateTodo() {
  let toDo = taskData.filter((t) => t["todo"] == "toDo");

  document.getElementById("toDo").innerHTML = "";
  if (toDo.length === 0) {
    document.getElementById("toDo").innerHTML =
      "<div class='noToDo'>No Tasks to do.</div>";
  } else {
    for (let index = 0; index < toDo.length; index++) {
      const element = toDo[index];
      document.getElementById("toDo").innerHTML +=
        generateTodoHTMLBoard(element);
    }
  }
}

/**
 * Updates the "In Progress" column with tasks that have the status "inProgress".
 * If there are no tasks, displays a message indicating no tasks are in progress.
 */
function updateInProgress() {
  let inProgress = taskData.filter((t) => t["todo"] == "inProgress");

  document.getElementById("inProgress").innerHTML = "";
  if (inProgress.length === 0) {
    document.getElementById("inProgress").innerHTML =
      "<div class='noToDo'>No Tasks in Progress.</div>";
  } else {
    for (let index = 0; index < inProgress.length; index++) {
      const element = inProgress[index];
      document.getElementById("inProgress").innerHTML +=
        generateTodoHTMLBoard(element);
    }
  }
}

/**
 * Updates the "Await Feedback" column with tasks that have the status "awaitFeedback".
 * If there are no tasks, displays a message indicating no tasks are awaiting feedback.
 */
function updateAwaitFeedback() {
  let awaitFeedback = taskData.filter((t) => t["todo"] == "awaitFeedback");

  document.getElementById("awaitFeedback").innerHTML = "";
  if (awaitFeedback.length === 0) {
    document.getElementById("awaitFeedback").innerHTML =
      "<div class='noToDo'>No Tasks await Feedback.</div>";
  } else {
    for (let index = 0; index < awaitFeedback.length; index++) {
      const element = awaitFeedback[index];
      document.getElementById("awaitFeedback").innerHTML +=
        generateTodoHTMLBoard(element);
    }
  }
}

/**
 * Updates the "Done" column with tasks that have the status "done".
 * If there are no tasks, displays a message indicating no tasks are done.
 */
function updateDone() {
  let done = taskData.filter((t) => t["todo"] == "done");

  document.getElementById("done").innerHTML = "";
  if (done.length === 0) {
    document.getElementById("done").innerHTML =
      "<div class='noToDo'>No Tasks done.</div>";
  } else {
    for (let index = 0; index < done.length; index++) {
      const element = done[index];
      document.getElementById("done").innerHTML +=
        generateTodoHTMLBoard(element);
    }
  }
}

/**
 * Toggle the visibility of the drag menu for a specific task.
 * Closes other open drag menus and toggles the visibility of the clicked one.
 *
 * @param {Event} event - The click event.
 * @param {string} taskId - The ID of the task.
 * @param {string} menuId - The ID of the drag menu to toggle.
 */
function toggleDragmenu(event, taskId, menuId) {
  event.stopPropagation();
  const dragMenu = document.getElementById(menuId);
  const allDragMenus = document.querySelectorAll(".dragMenu");
  allDragMenus.forEach((menu) => {
    if (menu.id !== menuId) {
      menu.classList.add("d-none");
    }
  });
  if (dragMenu.classList.contains("d-none")) {
    dragMenu.classList.remove("d-none");
  } else {
    dragMenu.classList.add("d-none");
  }
}

/**
 * Update the task data array with the updated fields for a specific task.
 *
 * @param {number} id - The ID of the task to be updated.
 * @param {Object} updatedFields - An object containing the updated fields for the task.
 */
function updateTaskData(id, updatedFields) {
  const index = taskData.findIndex((t) => t.id === id);
  if (index !== -1) {
    taskData[index] = {
      ...taskData[index],
      ...updatedFields,
    };
  } else {
    taskData.push({
      id: id,
      ...updatedFields,
      todo: "toDo",
    });
  }
}

/**
 * Updates the progress bar and task counter of a task.
 * This function calculates the completion percentage of subtasks and updates the progress bar element.
 *
 * @param {Object} todo - The task object containing subtasks.
 */
function updateProgressBar(todo) {
  let completedSubtasks = todo.subTasks.filter(
    (subtask) => subtask.completed
  ).length;
  let progressBarId = `progress-bar-${todo.id}`;
  let progressBar = document.getElementById(progressBarId);
  let progress = (completedSubtasks / todo.subTasks.length) * 100;
  if (progressBar) {
    let innerProgressBar = progressBar.querySelector(".progress-bar");
    if (innerProgressBar) {
      innerProgressBar.style.width = `${(progress / 100) * 128}px`;
      innerProgressBar.style.backgroundColor = "#4589FF";
    }
  }
  let taskCounter = progressBar.nextElementSibling;
  if (taskCounter) {
    taskCounter.textContent = `${completedSubtasks}/${todo.subTasks.length} Subtasks`;
  }
}

/**
 * Display the filtered to-dos by updating the corresponding columns.
 * Resets the columns, updates them with filtered to-dos, and displays a message if any column is empty.
 *
 * @param {Array<Object>} filteredTodos - An array of filtered to-do objects.
 */
function displayFilteredTodos(filteredTodos) {
  resetTodoColumns();
  const hasTodos = {
    toDo: false,
    inProgress: false,
    awaitFeedback: false,
    done: false,
  };

  filteredTodos.forEach((todo) => {
    updateTodoColumn(todo);
    hasTodos[todo.todo] = true;
  });

  displayEmptyMessage(hasTodos);
}

/**
 * Reset the content of all to-do columns.
 * Clears the inner HTML of the columns to prepare for new content.
 */
function resetTodoColumns() {
  document.getElementById("toDo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("awaitFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";
}

/**
 * Update a specific to-do column with a new to-do item.
 * Appends the HTML for the to-do item to the appropriate column.
 *
 * @param {Object} todo - A to-do object containing the details of the to-do item.
 */
function updateTodoColumn(todo) {
  const column = document.getElementById(todo.todo);
  if (column) {
    column.innerHTML += generateTodoHTMLBoard(todo);
  }
}

/**
 * Display a message in each to-do column if it is empty.
 * Adds a "No Tasks" message to columns that have no to-do items.
 *
 * @param {Object} hasTodos - An object indicating whether each to-do column has any items.
 * @param {boolean} hasTodos.toDo - Indicates if the "To Do" column has items.
 * @param {boolean} hasTodos.inProgress - Indicates if the "In Progress" column has items.
 * @param {boolean} hasTodos.awaitFeedback - Indicates if the "Await Feedback" column has items.
 * @param {boolean} hasTodos.done - Indicates if the "Done" column has items.
 */
function displayEmptyMessage(hasTodos) {
  if (!hasTodos.toDo)
    document.getElementById("toDo").innerHTML =
      "<div class='noToDo'>No Tasks to do.</div>";
  if (!hasTodos.inProgress)
    document.getElementById("inProgress").innerHTML =
      "<div class='noToDo'>No Tasks in progress.</div>";
  if (!hasTodos.awaitFeedback)
    document.getElementById("awaitFeedback").innerHTML =
      "<div class='noToDo'>No Tasks awaiting feedback.</div>";
  if (!hasTodos.done)
    document.getElementById("done").innerHTML =
      "<div class='noToDo'>No Tasks done.</div>";
}

/**
 * Initialize functions on window load.
 * Includes HTML content, initializes the board, and adjusts the onclick behavior of buttons.
 */
window.onload = function () {
  includeHTML();
  initBoard();
  adjustOnClickBehavior();
};

/**
 * Adjust the onclick behavior of buttons when the window is resized.
 */
window.onresize = adjustOnClickBehavior;

/**
 * Saves the selected contacts to local storage.
 */
function saveSelectedContactsBoard() {
  localStorage.setItem("selectedContacts", JSON.stringify(selectedContacts));
}

/**
 * Handles subtask edit action.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function subtaskEditBoard(index) {
  let subtaskContent = document.getElementById(`subtask${index}`);
  let subtaskEditInput = document.getElementById(`subtaskEditInput${index}`);
  let mainBoundingBox = document.getElementById(`mainBoundingBox${index}`);

  mainBoundingBox.classList.add("d-none");
  subtaskContent.classList.add("d-none");
  subtaskEditInput.classList.remove("d-none");
}

/**
 * Handles subtask save edit action.
 *
 * @param {number} index - The index of the subtask to save edit.
 */
function subtaskSaveEditBoard(index) {
  let subtaskContent = document.getElementById(`subtask${index}`);
  let subtaskEditInput = document.getElementById(`subtaskEditInput${index}`);
  let subtaskInput = document.getElementById(`subtaskInput${index}`);
  let mainBoundingBox = document.getElementById(`mainBoundingBox${index}`);

  mainBoundingBox.classList.remove("d-none");
  subtaskContent.querySelector(
    "span"
  ).textContent = `\u2022 ${subtaskInput.value}`;
  subtaskContent.classList.toggle("d-none");
  subtaskEditInput.classList.toggle("d-none");
}

/**
 * Deletes a subtask.
 *
 * @param {number} index - The index of the subtask to delete.
 */
function subtaskDeleteBoard(index) {
  let subtaskElement = document.getElementById(`subtaskContainer${index}`);
  if (subtaskElement) {
    subtaskElement.remove();
  }
}

/**
 * Updated assignedContactOnTaskBoard function to store assigned contacts in localStorage.
 */
function assignedContactOnTaskBoard(taskId) {
  if (taskId >= 0 && taskId < taskData.length) {
    let assignedContacts = taskData[taskId]["assignTo"];
    localStorage.setItem("selectedContacts", JSON.stringify(assignedContacts));
  } else {
    console.error("Ungültige Task-ID.");
  }
}

/**
 * Edits a task.
 * @param {number} id - The ID of the task to edit.
 */
function editTask(id) {
  const todo = taskData.find((todo) => todo.id === id);
  renderEditTaskForm(todo);
}

/**
 * Renders the list of assigned contacts in the "Assign To" section.
 */
function renderAssignedContactsBoard(taskId) {
  let assignedUser = document.getElementById("assignedUser");
  renderAssignedUserBoard(assignedUser, taskId);
}

/**
 * Function to clear selectedContacts array from localStorage.
 */
function clearSelectedContacts() {
  localStorage.removeItem("selectedContacts");
}
