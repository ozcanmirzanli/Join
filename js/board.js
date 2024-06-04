let subTaskIdCounter = 0;
let currentDraggedElement = [];

/**
 * Initializes the task board by loading task data and updating the HTML board.
 * This function is asynchronous and waits for the task data to be loaded before updating the board.
 */
async function initBoard() {
    await loadTasksDataBoard();
    await getContactBoard();
    await initHeader();
    updateHTMLBoard();
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

async function getContactBoard() {
  try {
    contacts = JSON.parse(await getItem("contact"));
  } catch (error) {
    console.info("Could not load contacts");
  }
}

/**
 * Updates the HTML board based on the current state of todos.
 */
function updateHTMLBoard() {
  updateTodo();
  updateInProgress();
  updateAwaitFeedback();
  updateDone();
}

function updateTodo(){
  let toDo = taskData.filter((t) => t["todo"] == "toDo"); 

  document.getElementById("toDo").innerHTML = ""; 
  if (toDo.length === 0) {
    document.getElementById("toDo").innerHTML =
      "<div class='noToDo'>No Tasks to do.</div>"; 
  } else {
    for (let index = 0; index < toDo.length; index++) {
      const element = toDo[index];
      document.getElementById("toDo").innerHTML += generateTodoHTMLBoard(element);
    }
  }
}

function updateInProgress(){
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

function updateAwaitFeedback(){
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

function updateDone(){
  let done = taskData.filter((t) => t["todo"] == "done"); 

  document.getElementById("done").innerHTML = ""; 
  if (done.length === 0) {
    document.getElementById("done").innerHTML =
      "<div class='noToDo'>No Tasks done.</div>"; 
  } else {
    for (let index = 0; index < done.length; index++) {
      const element = done[index];
      document.getElementById("done").innerHTML += generateTodoHTMLBoard(element); 
    }
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
async function moveTo(category) {
  let draggedTask = taskData.find(task => task.id === currentDraggedElement);

  if (draggedTask) {
    draggedTask.todo = category; 
    await saveDraggedTask(draggedTask);
    updateHTMLBoard(); 
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
  renderBigTask(task);
}

/**
 * Closes the big task view.
 */
function closeTaskBig() {
  document.getElementById("taskBig").classList.remove("bigTask");
  document.getElementById("taskBig").classList.add("d-none");
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

function displayFilteredTodos(filteredTodos) {
  resetTodoColumns();
  const hasTodos = { toDo: false, inProgress: false, awaitFeedback: false, done: false };

  filteredTodos.forEach((todo) => {
    updateTodoColumn(todo);
    hasTodos[todo.todo] = true;
  });

  displayEmptyMessage(hasTodos);
}

function resetTodoColumns() {
  document.getElementById("toDo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("awaitFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";
}

function updateTodoColumn(todo) {
  const column = document.getElementById(todo.todo);
  if (column) {
    column.innerHTML += generateTodoHTMLBoard(todo);
  }
}

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
 * Saves a new or edited task with the specified ID.
 * This function collects input values from the form, creates or updates a task object, and stores it in local storage.
 * 
 * @async
 * @param {number} id - The ID of the task to save.
 */
async function saveTaskBoard(id) {
  let subTasks = document.getElementById('addsubtask').value;
  let subTasksArray = subTasks.split('\n').map(subTask => ({
      id: subTaskIdCounter++,
      content: subTask.trim(),
      completed: false
  }));
  const currentTodo = taskData.find(task => task.id === id);
  const currentPriority = currentTodo ? currentTodo.priority : '';
  const currentAssignedTo = currentTodo ? currentTodo.assignTo : [];
  const updatedFields = {
      title: document.getElementById('titleAddTask').value,
      description: document.getElementById('descriptionAddTask').value,
      assignTo: [...currentAssignedTo, ...selectedContacts.filter(contact => !currentAssignedTo.some(existingContact => existingContact.email === contact.email))],
      dueDate: document.getElementById('dueDate').value,
      category: document.getElementById('categoryAddTask').value,
      subTasks: subTasksArray,
      priority: selectedPrio || currentPriority,
  };

  const index = taskData.findIndex(t => t.id === id);
  if (index !== -1) {
      taskData[index] = {
          ...taskData[index],
          ...updatedFields
      };
  } else {
      taskData.push({
          id: id,
          ...updatedFields,
          todo: 'toDo'
      });
  }

  await setItem('taskData', JSON.stringify(taskData));
  closeTaskBig();
}

/**
* Updates the progress bar of a task.
* This function calculates the completion percentage of subtasks and updates the progress bar element.
* 
* @param {Object} todo - The task object containing subtasks.
*/
function updateProgressBar(todo) {
  let completedSubtasks = todo.subTasks.filter(subtask => subtask.completed).length;
  let progressBarId = `progress-bar-${todo.id}`;
  let progressBar = document.getElementById(progressBarId);
  let progress = (completedSubtasks / todo.subTasks.length) * 100;
  if (progressBar) {
      let innerProgressBar = progressBar.querySelector('.progress-bar');
      if (innerProgressBar) {
          innerProgressBar.style.width = `${(progress / 100) * 128}px`;
          innerProgressBar.style.backgroundColor = '#4589FF';
      }
  }
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
 * Adjusts the onclick behavior of buttons based on window width.
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
      };});
  } else {
    plusMobile.onclick = openAddTaskDialog;
    addTaskBtns.forEach(button => {
      button.onclick = openAddTaskDialog;
    });
  }
}

window.onload = function() {
  includeHTML();
  initBoard();
  adjustOnClickBehavior(); 
};

window.onresize = adjustOnClickBehavior;