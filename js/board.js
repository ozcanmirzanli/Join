let subTaskIdCounter = 0;
let currentDraggedElement;
let touchStartX, touchStartY;

/**
 * Event listener for the DOMContentLoaded event.
 * This event listener initializes various functions and behaviors after the DOM content is loaded.
 *
 * @param {Event} event - The DOMContentLoaded event object.
 */
document.addEventListener('DOMContentLoaded', async (event) => {
  includeHTML();
  await new Promise(resolve => {
      window.onload = resolve;
  });
  if (document.getElementById('toDo')) {
      await initBoard();
  } else {
      console.warn('Element mit ID "toDo" nicht gefunden. Board-Funktionalität wird auf dieser Seite nicht benötigt.');
  }
  const plusMobile = document.getElementById("plusMobile");
  const addTaskBtns = document.querySelectorAll(".plus, #addTaskBtn");
  if (plusMobile && addTaskBtns.length > 0) {
      adjustOnClickBehavior();
  } else {
      console.warn('Elemente mit ID "plusMobile" oder Klasse "plus" bzw. ID "addTaskBtn" nicht gefunden.');
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
      console.error('Fehler in updateHTMLBoard:', error);
  }
}

/**
 * Loads the task data from storage and parses it into the `taskData` variable.
 * This function is asynchronous and uses a try-catch block to handle potential errors during data loading.
 */
async function loadTasksDataBoard() {
    try {
        taskData = JSON.parse(await getItem('taskData'));
    } catch (e) {
        console.info('Could not load tasks');
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
    contacts = JSON.parse(await getItem("contact"));
  } catch (error) {
    console.info("Could not load contacts");
  }
}

/**
 * Initiates the dragging of a todo element.
 * @param {number} id - The ID of the todo element.
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Prevents the default action of a drop event.
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves a task to a different category and updates the HTML board.
 * @param {string} category - The category to move the task to.
 */
function moveTo(category, event) {
  let draggedTask = taskData.find(task => task.id === currentDraggedElement);

  if (draggedTask) {
      draggedTask.todo = category;
      saveDraggedTask(draggedTask)
          .then(() => updateHTMLBoard());
  }
}

/**
 * Move the dragged task to a specified category and update the board.
 * Updates the 'todo' property of the dragged task and saves the changes.
 *
 * @param {string} category - The new category to move the task to (e.g., 'toDo', 'inProgress', 'awaitFeedback', 'done').
 * @param {Event} event - The event object representing the click event.
 */
function moveToMenu(category, event) {
  event.stopPropagation();
  let draggedTask = taskData.find(task => task.id === currentDraggedElement);

  if (draggedTask) {
      draggedTask.todo = category;
      saveDraggedTask(draggedTask)
          .then(() => updateHTMLBoard());
  }
}

/**
 * Saves the updated task after it has been dragged and dropped.
 * This function finds the task in the `taskData` array by its ID and updates it.
 * The updated task data is then saved back to storage.
 * 
 * @param {Object} updatedTask - The task object that has been updated after dragging.
 * @param {number} updatedTask.id - The ID of the updated task.
 * @returns {Promise<void>} A promise that resolves when the task data has been saved.
 */
async function saveDraggedTask(updatedTask) {
  const index = taskData.findIndex(task => task.id === updatedTask.id);

  if (index !== -1) {
      taskData[index] = updatedTask;
      await setItem('taskData', JSON.stringify(taskData));
  }
}

/**
 * Opens a task when clicked on.
 * @param {number} id - The ID of the task to open.
 */
function openTask(id) {
  let task = taskData.find((todo) => todo.id === id);
  document.getElementById("taskBig").classList.remove("d-none");
  document.getElementById("taskBig").classList.add("overlay");
  document.body.style.overflow = 'hidden';
  renderBigTask(task);
}

/**
 * Closes the big task view.
 */
function closeTaskBig() {
  document.getElementById("taskBig").classList.remove("overlay");
  document.getElementById("taskBig").classList.add("d-none");
  document.body.style.overflow = 'auto';
}

/**
 * Filters tasks based on search criteria.
 */
function filterTasks() {
  let search = document.getElementById("search").value.toLowerCase();

  let filteredTodos = taskData.filter(
    (todo) =>
      (todo.title.toLowerCase().includes(search) ||
      todo.description.toLowerCase().includes(search)) &&
      (todo.todo === "toDo" ||
      todo.todo === "inProgress" ||
      todo.todo === "awaitFeedback" ||
      todo.todo === "done")
  );

  displayFilteredTodos(filteredTodos);
}

/**
 * Display the filtered to-dos by updating the corresponding columns.
 * Resets the columns, updates them with filtered to-dos, and displays a message if any column is empty.
 *
 * @param {Array<Object>} filteredTodos - An array of filtered to-do objects.
 */
function displayFilteredTodos(filteredTodos) {
  resetTodoColumns();
  const hasTodos = { toDo: false, inProgress: false, awaitFeedback: false, done: false };

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
  if (!hasTodos.toDo) document.getElementById("toDo").innerHTML = "<div class='noToDo'>No Tasks to do.</div>";
  if (!hasTodos.inProgress) document.getElementById("inProgress").innerHTML = "<div class='noToDo'>No Tasks in progress.</div>";
  if (!hasTodos.awaitFeedback) document.getElementById("awaitFeedback").innerHTML = "<div class='noToDo'>No Tasks awaiting feedback.</div>";
  if (!hasTodos.done) document.getElementById("done").innerHTML = "<div class='noToDo'>No Tasks done.</div>";
}

/**
 * Shows the add task board.
 */
function showaddTaskBoard() {
  let addTask = document.getElementById("addTask"); //get element with id 'addTask'
  addTask.style.display = "block";
  addTask.style.right = "620px"; //add class 'addTask'
}

/**
 * Opens the add task dialog.
 */
function openAddTaskDialog() {
  const dialogContent = document.createElement("div");
  dialogContent.innerHTML = renderAddTaskForm();
  document.body.appendChild(dialogContent);
  document.getElementById("addTaskDialog").classList.add("overlay");
  document.body.style.overflow = 'hidden';
  changePriorityColor("medium");
}

/**
 * Closes the add task dialog.
 * This function finds the element with the class `dialog-content` and removes it from the DOM,
 * effectively closing the dialog.
 */
function closeAddTaskDialog() {
  const dialogContent = document.querySelector(".dialog-content");
  if (dialogContent) {
      dialogContent.remove();
  }
  document.getElementById("addTaskDialog").classList.remove("overlay");
  document.body.style.overflow = 'auto';
}

/**
 * Deletes a task.
 * @param {number} id - The ID of the task to delete.
 */
async function deleteTaskBoard(id) {
  const index = taskData.findIndex((todo) => todo.id === id);
     taskData.splice(index, 1);
     await setItem("taskData", JSON.stringify(taskData));
     await getContact();
    updateHTMLBoard();
    closeTaskBig();
}

/**
 * Save the task to the task board with updated details.
 * Updates the task data and persists it to storage.
 *
 * @param {number} id - The ID of the task to be saved.
 * @returns {Promise<void>} - A promise that resolves when the task data is saved.
 */
async function saveTaskBoard(id) {
  const subTasksArray = getSubTasksArray();
  const currentTodo = taskData.find(task => task.id === id);
  const updatedFields = getUpdatedFields(currentTodo, subTasksArray);

  updateTaskData(id, updatedFields);
  await setItem('taskData', JSON.stringify(taskData));
  closeTaskBig();
}

/**
 * Retrieve the sub-tasks from the input field and format them into an array of objects.
 *
 * @returns {Array<Object>} - An array of sub-task objects.
 */
function getSubTasksArray() {
  let subTasks = document.getElementById('addsubtask').value;
  return subTasks.split('\n').map(subTask => ({
    id: subTaskIdCounter++,  // Assumes subTaskIdCounter is defined elsewhere
    content: subTask.trim(),
    completed: false
  }));
}

/**
 * Get the updated fields for a task based on user input and existing task details.
 *
 * @param {Object} currentTodo - The current task object.
 * @param {Array<Object>} subTasksArray - An array of sub-task objects.
 * @returns {Object} - An object containing the updated fields for the task.
 */
function getUpdatedFields(currentTodo, subTasksArray) {
  const currentPriority = currentTodo ? currentTodo.priority : '';
  const currentAssignedTo = currentTodo ? currentTodo.assignTo : [];
  return {
    title: document.getElementById('titleAddTask').value,
    description: document.getElementById('descriptionAddTask').value,
    assignTo: [...currentAssignedTo, ...selectedContacts.filter(contact => !currentAssignedTo.some(existingContact => existingContact.email === contact.email))],
    dueDate: document.getElementById('dueDate').value,
    category: document.getElementById('categoryAddTask').value,
    subTasks: subTasksArray,
    priority: selectedPrio || currentPriority,
  };
}

/**
* Saves updated subtasks of a task.
* This function finds the task by ID, updates its subtasks, and stores the updated task list in local storage.
* 
* @async
* @param {number} id - The ID of the task to update.
* @param {Array} subTasks - The array of updated subtasks.
*/
async function saveSubtaskBoard(id, subTasks) {
  const updatedTask = taskData.find(task => task.id === id);
  if (updatedTask) {
      updatedTask.subTasks = subTasks;
      await setItem('taskData', JSON.stringify(taskData));
  }
}

/**
 * Opens the "Assign To" dropdown menu and renders the contact list.
 */
function openAssignToBoard() {
  let dropDownMenu = document.getElementById("assignToDropdown");
  let inputAssignedTo = document.querySelector(".input-assignedTo");
  let selectContactsText = document.getElementById("select-contacts");
  dropDownMenu.classList.remove("d-none");
  document.getElementById("assignedUser").classList.add("d-none");
  document.getElementById("arrowdown").classList.add("d-none");
  document.getElementById("arrowup").classList.remove("d-none");
  inputAssignedTo.style.border = "1px solid #29ABE2";
  selectContactsText.innerHTML = "";
  renderContactsBoard();
  renderAssignedContactsBoard();
  restoreSelectedContactsBoard();
}

/**
 * Closes the "Assign To" dropdown menu.
 */
function closeAssignToBoard() {
  let dropDownMenu = document.getElementById("assignToDropdown");
  let inputAssignedTo = document.querySelector(".input-assignedTo");
  let selectContactsText = document.getElementById("select-contacts");
  dropDownMenu.classList.add("d-none");
  document.getElementById("assignedUser").classList.remove("d-none");
  document.getElementById("arrowup").classList.add("d-none");
  document.getElementById("arrowdown").classList.remove("d-none");
  inputAssignedTo.style.border = "";
  selectContactsText.innerHTML = "Select contacts to assign";
}

/**
 * Saves the selected contacts to local storage.
 */
function saveSelectedContactsBoard() {
  localStorage.setItem("selectedContacts", JSON.stringify(selectedContacts));
}

/**
 * Renders the list of assigned contacts in the "Assign To" section.
 */
function renderAssignedContactsBoard() {
  let assignedUser = document.getElementById("assignedUser");
  renderAssignedUserBoard(assignedUser);
}

/**
 * Restores the selected contacts from local storage and updates the UI.
 */
function restoreSelectedContactsBoard() {
  let selectedContactsFromStorage = JSON.parse(localStorage.getItem("selectedContacts"));
  if (selectedContactsFromStorage) {
    selectedContacts = selectedContactsFromStorage;
    selectedContacts.forEach((contact) => {
      let index = contacts.findIndex((c) => c.name === contact.name);
      if (index !== -1) {
        let contactElement = document.getElementById(`contact${index}`);
        contactElement.classList.add("contactSelected");
        let checkbox = document.getElementById(`checkbox${index}`);
        checkbox.src = "./assets/img/addTask_AssignTo_Checkbox_Checked.svg";
      }
    });
  }
}

/**
 * Renders the contact list in the "Assign To" dropdown menu.
 */
function renderContactsBoard() {
  let assignList = document.getElementById("assignToList");
  assignList.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let badgeColor = contact.color;
    assignList.innerHTML += getassignListHTMLBoard(contact, badgeColor, i);
  }
}

/**
 * Toggles the selection of a contact and updates the UI and local storage.
 * 
 * @param {number} i - The index of the contact.
 * @param {string} contactName - The name of the contact.
 */
function assignContactBoard(i, contactName) {
  let contact = document.getElementById(`contact${i}`);
  let checkbox = document.getElementById(`checkbox${i}`);
  contact.classList.toggle("contactSelected");
  let isSelected = contact.classList.contains("contactSelected");
  if (isSelected) {
    checkbox.src = "./assets/img/addTask_AssignTo_Checkbox_Checked.svg";
    selectedContacts.push(contacts[i]) - 1;
    addToAssignedUserBoard(i, contacts[i]);
  } else {
    unassignContactsBoard(contactName, checkbox);
  }
  saveSelectedContactsBoard();
}

/**
 * Adds a contact to the list of assigned users and updates the UI.
 * 
 * @param {number} i - The index of the contact.
 */
function addToAssignedUserBoard(i) {
  let assignedUser = document.getElementById("assignedUser");
  let assignedContact = selectedContacts[i];
  assignedContacts.push(assignedContact);
  renderAssignedUserBoard(assignedUser);
}

/**
 * Unassigns a contact and updates the UI and local storage.
 * 
 * @param {string} contactName - The name of the contact to unassign.
 * @param {HTMLElement} checkbox - The checkbox element of the contact.
 */
function unassignContactsBoard(contactName, checkbox) {
  checkbox.src = "./assets/img/addTask_AssignTo_Checkbox.svg";
  let selectedContactIndex = findSelectedIndexBoard(contactName);
  selectedContacts.splice(selectedContactIndex, 1);
  removeFromAssignedListBoard(selectedContactIndex);
}

/**
 * Finds the index of a selected contact by name.
 * 
 * @param {string} contactName - The name of the contact.
 * @returns {number} - The index of the selected contact.
 */
function findSelectedIndexBoard(contactName) {
  return selectedContacts.findIndex((contact) => contact["name"] === contactName);
}

/**
 * Removes a contact from the list of assigned users and updates the UI and local storage.
 * 
 * @param {number} selectedContactIndex - The index of the selected contact.
 */
function removeFromAssignedListBoard(selectedContactIndex) {
  let assignedUser = document.getElementById("assignedUser");
  assignedContacts.splice(selectedContactIndex, 1);
  renderAssignedUserBoard(assignedUser);
  saveSelectedContactsBoard();
}

/**
 * Clears the list of assigned users and updates the UI.
 */
function clearAssignedUserBoard() {
  assignedContacts = [];
  selectedContacts = [];
  renderAssignedUserBoard(assignedUser);
  document.querySelectorAll(".checkbox").forEach(function (checkbox) {
    checkbox.src = "./assets/img/addTask_AssignTo_Checkbox.svg";
  });
  let contactsElements = document.querySelectorAll(".assignListContact");
  contactsElements.forEach(function (contact) {
    contact.classList.remove("contactSelected");
  });
}

/**
 * Adjust the onclick behavior of specific buttons based on window width.
 * If the window width is less than 580 pixels, clicking the buttons will redirect to 'add_task.html'.
 * Otherwise, the buttons will open the 'Add Task' dialog.
 */
function adjustOnClickBehavior() {
  const plusMobile = document.getElementById("plusMobile");
  const addTaskBtns = document.querySelectorAll(".plus, #addTaskBtn");
  if (window.innerWidth < 580) {
    plusMobile.onclick = function() {
      window.location.href = './add_task.html';
    };
    addTaskBtns.forEach(button => {
      button.onclick = function() {
        window.location.href = './add_task.html';
      };
    });
  } else {
    plusMobile.onclick = openAddTaskDialog;
    addTaskBtns.forEach(button => {
      button.onclick = openAddTaskDialog;
    });
  }
}

/**
 * Initialize functions on window load.
 * Includes HTML content, initializes the board, and adjusts the onclick behavior of buttons.
 */
window.onload = function() {
  includeHTML();
  initBoard();
  adjustOnClickBehavior(); 
};

/**
 * Adjust the onclick behavior of buttons when the window is resized.
 */
window.onresize = adjustOnClickBehavior;