/**
 * Global array to store data.
 * @type {Array<Object>}
 */
let subtask = [];
let taskData = [];
let taskIdCounter = 0;
let selectedPrio = "";
let newTask = [];
let contacts = [];
let selectedContacts = [];
let assignedContacts = [];

/**
 * Initializes the application side.
 */
async function init() {
  includeHTML();
  await loadTasksData();
  await getContact();
}

/**
 * Loads task data from remote storage.
 */
async function loadTasksData() {
  try {
    taskData = JSON.parse(await getItem("taskData"));
  } catch (e) {
    console.info("Could not load tasks");
  }
}

/**
 * Loads contact data from remote storage.
 */
async function getContact() {
  try {
    contacts = JSON.parse(await getItem("contact"));
  } catch (error) {
    console.info("Could not load contacts");
  }
  // Loading selected contacts from local storage
  try {
    selectedContacts =
      JSON.parse(localStorage.getItem("selectedContacts")) || [];
  } catch (error) {
    console.info("Could not load selected contacts");
  }
}

/**
 * Sets all buttons back to default colors and font colors.
 *
 * @param {string} priority - The priority level.
 */
function changePriorityColor(priority) {
  document.getElementById("btnPrioUrgent").style.backgroundColor = "#ffffff";
  document.getElementById("btnPrioUrgent").style.color = "#000000";
  document.getElementById("btnPrioUrgent").style.borderColor = "#D1D1D1";
  document.getElementById("btnPrioUrgent").getElementsByTagName("img")[0].src =
    "assets/img/urgent_red_AddTask.svg";

  document.getElementById("btnPrioMedium").style.backgroundColor = "#ffffff";
  document.getElementById("btnPrioMedium").style.color = "#000000";
  document.getElementById("btnPrioMedium").style.borderColor = "#D1D1D1";
  document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src =
    "assets/img/medium_orange_AddTask.svg";

  document.getElementById("btnPrioLow").style.backgroundColor = "#ffffff";
  document.getElementById("btnPrioLow").style.color = "#000000";
  document.getElementById("btnPrioLow").style.borderColor = "#D1D1D1";
  document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src =
    "assets/img/low_green_AddTask.svg";
  /**
   * Change the colors of the clicked button according to priority
   *
   */
  // prettier-ignore
  if (priority === "urgent") {
    document.getElementById("btnPrioUrgent").style.backgroundColor = "#FF3D00";
    document.getElementById("btnPrioUrgent").style.color = "#FFFFFF";
    document.getElementById("btnPrioUrgent").style.borderColor = "#FF3D00";
    document.getElementById("btnPrioUrgent").getElementsByTagName("img")[0].src ="assets/img/urgent_white_AddTask.svg";
    selectedPrio = "Urgent";
  } else if (priority === "medium") {
    document.getElementById("btnPrioMedium").style.backgroundColor = "#FFA800";
    document.getElementById("btnPrioMedium").style.color = "#FFFFFF";
    document.getElementById("btnPrioMedium").style.borderColor = "#FFA800";
    document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src ="assets/img/medium_white_AddTask.svg";
    selectedPrio = "Medium";
  } else if (priority === "low") {
    document.getElementById("btnPrioLow").style.backgroundColor = "#7AE229";
    document.getElementById("btnPrioLow").style.color = "#FFFFFF";
    document.getElementById("btnPrioLow").style.borderColor = "#7AE229";
    document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src ="assets/img/low_white_AddTask.svg";
    selectedPrio = "Low";
  }
}

/**
 * Checks if the selected due date is valid.
 * Only current day or future day are allowed.
 */
function checkDueDate() {
  let selectedDate = new Date(document.getElementById("dueDate").value);
  let currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  if (selectedDate < currentDate) {
    alert("Please select a date that is today or later for the due date.");
    document.getElementById("dueDate").value = ""; // Reset the input field
  }
}

/**
 * Toggles the visibility of subtasks section.
 */
function toggleSubtasks() {
  const subtasksDiv = document.getElementById("subtasks");
  const plusIcon = document.getElementById("plusIcon");
  const cancelSubtask = document.getElementById("cancelSubtask");

  if (subtasksDiv.classList.contains("d-none")) {
    subtasksDiv.classList.remove("d-none");
    plusIcon.classList.add("d-none");
  } else {
    subtasksDiv.classList.add("d-none");
    plusIcon.classList.remove("d-none");
  }
}

/**
 * Handles click event on cancel subtask button.
 */
function cancelSubtaskClick() {
  const subtasksDiv = document.getElementById("subtasks");
  const plusIcon = document.getElementById("plusIcon");
  const addSubtaskInput = document.getElementById("addsubtask");

  subtasksDiv.classList.add("d-none");
  plusIcon.classList.remove("d-none");
  addSubtaskInput.value = "";
}

/**
 * Saves a new subtask and push subtask into subtask global arra.
 * Improve better handover to remote storage array taskData.
 */
function saveSubtask() {
  let subtaskInput = document.getElementById("addsubtask");
  let subtaskText = subtaskInput.value;

  if (subtaskText !== "") {
    let subtaskId = subtask.length; // Creating a unique ID for the subtask

    subtask.push({ id: subtaskId, content: subtaskText, completed: false }); // Adding the subtask to the global array
    const subtaskHTML = renderSubtaskItem(subtaskText, subtaskId); // Creating the HTML code for the subtask
    const showSubtasksContainer = document.getElementById("showsubtasks"); // Adding the subtask HTML code to the element with ID 'showsubtasks'
    showSubtasksContainer.insertAdjacentHTML("beforeend", subtaskHTML);
    
    subtaskInput.value = ""; // Clear subtask input

    showSubtasksContainer.classList.remove("d-none"); // Displaying the subtasks
  }
}

/**
 * Handles subtask edit action.
 *
 * @param {number} i - The index of the subtask to edit.
 */
function subtaskEdit(i) {
  let subtaskContent = document.getElementById(`subtask${i}`);
  let subtaskEditInput = document.getElementById(`subtaskEditInput${i}`);
  document.getElementById(`mainBoundingBox${i}`).classList.add('d-none');

  subtaskContent.classList.toggle('d-none');
  subtaskEditInput.classList.toggle('d-none');
}

/**
 * Handles subtask save edit action.
 *
 * @param {number} i - The index of the subtask to save edit.
 */
function subtaskSaveEdit(i) {
  let subtaskContent = document.getElementById(`subtask${i}`);
  let subtaskEditInput = document.getElementById(`subtaskEditInput${i}`);
  let subtaskInput = document.getElementById(`subtaskInput${i}`);
  document.getElementById(`mainBoundingBox${i}`).classList.remove('d-none');

  subtaskContent.querySelector('span').textContent = `\u2022 ${subtaskInput.value}`;
  subtaskContent.classList.toggle('d-none');
  subtaskEditInput.classList.toggle('d-none');
}

/**
 * Deletes a subtask.
 *
 * @param {number} id - The ID of the subtask to delete.
 */
function subtaskDelete(id) {
  let index = subtask.findIndex(sub => sub.id === id); // Finding the index of the subtask in the global array based on its ID

  // Checking if the subtask is found
  if (index !== -1) {
    // Deleting the subtask from the global array
    subtask.splice(index, 1);

    let subtaskElement = document.getElementById(`subtask${id}`);
    subtaskElement.remove();

    let mainBoundingBox = document.getElementById(`mainBoundingBox${id}`);
    mainBoundingBox.remove();
    }
}

/**
 * Clears all form entries.
 */
function clearEntries() {
  document.getElementById("titleAddTask").value = ""; // Clear entries for title section
  document.querySelector(".padding-description textarea").value = ""; // Clear entries for description section
  clearAssignedUser(); // Clear entries for assigned to section
  document.getElementById("dueDate").value = ""; // Clear entries for due date section
  resetPriorityButtons(); // Clear entries for priority section
  resetCategorySection(); // Clear entries for category section
  document.getElementById("addsubtask").value = ""; // Clear entries for subtasks section
  clearShowSubtasks(); // Clear entries in the show subtasks section
  subtaskDelete();
  cancelSubtaskClick();
  subtask = [];
  changePriorityColor("medium");
}

/**
 * Clears all subtask entries displayed in HTML.
 */
function clearShowSubtasks() {
  const showSubtasks = document.getElementById("showsubtasks");
  // Remove all child elements of the showSubtasks DIV
  while (showSubtasks.firstChild) {
    showSubtasks.removeChild(showSubtasks.firstChild);
  }
}

/**
 * Resets priority buttons to default state.
 */
function resetPriorityButtons() {
  // Array containing the IDs of the priority buttons and their default images
  const priorityButtons = [
    { id: "btnPrioUrgent", imgSrc: "assets/img/urgent_red_AddTask.svg" },
    { id: "btnPrioMedium", imgSrc: "assets/img/medium_orange_AddTask.svg" },
    { id: "btnPrioLow", imgSrc: "assets/img/low_green_AddTask.svg" },
  ];

  // Loop through all button IDs
  priorityButtons.forEach((button) => {
    const buttonElement = document.getElementById(button.id);
    
    buttonElement.style.backgroundColor = "rgba(255, 255, 255, 1)"; // Reset background color
    buttonElement.style.borderColor = "#D1D1D1"; // Reset border color
    buttonElement.style.color = "rgba(0, 0, 0, 1)"; // Reset font color
    const imgElement = buttonElement.querySelector("img"); // Reset image
    imgElement.src = button.imgSrc;
  });
}

/**
 * Resets the category section to default state.
 */
function resetCategorySection() {
  const categoryDropdown = document.getElementById("categoryAddTask");
  // Set the selected index to the index of the `<option>` element with value ""
  categoryDropdown.selectedIndex = 0;
  // Reset border color
  categoryDropdown.style.borderColor = "#D1D1D1";
  // Re-add the onchange event
  categoryDropdown.onchange = handleCategoryChange;
}

/**
 * Creates a new task for remote storage array taskData.
 */
async function createTask() {
  // Check required fields
  let title = document.getElementById("titleAddTask").value;
  let dueDate = document.getElementById("dueDate").value;

  if (title === "" || dueDate === "") {
    alert("Please fill in all required fields.");
    return;
  }
  let subTasks = subtask;

  taskData.push({
    id: taskData.length,
    title: title,
    description: document.getElementById("descriptionAddTask").value,
    assignTo: assignedContacts,
    dueDate: dueDate,
    category: document.getElementById("categoryAddTask").value,
    subTasks: subTasks,
    priority: selectedPrio,
    todo: "toDo",
  });
    await setItem('taskData', JSON.stringify(taskData));

  checkDueDate();
  clearEntries();
}

/**
 * Toggles the assign to dropdown menu.
 */
function toggleAssignTo(event) {
  event.stopPropagation();
  let dropDownMenu = document.getElementById("assignToDropdown");
    if (dropDownMenu.classList.contains("d-none")) {
      openAssignTo();
    } else {
      closeAssignTo();
    }
}

/**
 * Handles clicks outside the assignAddTask div.
 */
function handleClickOutside(event) {
  let assignAddTask = document.getElementById("assignAddTask");
  let assignToDropdown = document.getElementById("assignToDropdown");
    if (!assignAddTask.contains(event.target) && !assignToDropdown.contains(event.target)) {
        closeAssignTo();
    }
}

/**
 * Opens the assign to dropdown menu.
 */
function openAssignTo() {
  let dropDownMenu = document.getElementById("assignToDropdown");
  let inputAssignedTo = document.querySelector(".input-assignedTo");
  let selectContactsText = document.getElementById("select-contacts");
  dropDownMenu.classList.remove("d-none");
  document.getElementById("assignedUser").classList.add("d-none");
  document.getElementById("arrowdown").classList.add("d-none");
  document.getElementById("arrowup").classList.remove("d-none");
  inputAssignedTo.style.border = "1px solid #29ABE2";
  selectContactsText.innerHTML = "";
  renderContacts();
  renderAssignedContacts();
  restoreSelectedContacts();

  document.addEventListener("click", handleClickOutside);
}

/**
 * Closes the assign to dropdown menu.
 */
function closeAssignTo() {
  let dropDownMenu = document.getElementById("assignToDropdown");
  let inputAssignedTo = document.querySelector(".input-assignedTo");
  let selectContactsText = document.getElementById("select-contacts");

  dropDownMenu.classList.add("d-none");
  document.getElementById("assignedUser").classList.remove("d-none");
  document.getElementById("arrowup").classList.add("d-none");
  document.getElementById("arrowdown").classList.remove("d-none");
  inputAssignedTo.style.border = "";
  selectContactsText.innerHTML = "Select contacts to assign";

  document.removeEventListener("click", handleClickOutside);
}

/**
 * Saves selected contacts to local storage.
 */
function saveSelectedContacts() {
  localStorage.setItem("selectedContacts", JSON.stringify(selectedContacts));
}

/**
 * Renders assigned contacts.
 */
function renderAssignedContacts() {
  let assignedUser = document.getElementById("assignedUser");
  renderassignedUser(assignedUser);
}

/**
 * Restores selected contacts from local storage.
 */
function restoreSelectedContacts() {
  let selectedContactsFromStorage = JSON.parse(
    localStorage.getItem("selectedContacts")
  );
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
 * Renders contacts in the assign to dropdown menu.
 */
function renderContacts() {
  let assignList = document.getElementById("assignToList");
  assignList.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let badgeColor = contact.color;
    assignToList.innerHTML += getassignListHTML(contact, badgeColor, i);
  }
}

/**
 * Handles assigning a contact to a task.
 */
function assignContact(i, contactName) {
  let contact = document.getElementById(`contact${i}`);
  let checkbox = document.getElementById(`checkbox${i}`);
  contact.classList.toggle("contactSelected");
  let isSelected = contact.classList.contains("contactSelected");

  if (isSelected) {
    checkbox.src = "./assets/img/addTask_AssignTo_Checkbox_Checked.svg";
    selectedContacts.push(contacts[i]);
    addToAssignedUser(contacts[i]);
  } else {
    unassignContacts(contactName, checkbox);
  }
  saveSelectedContacts();
}

/**
 * Adds assigned contact to assigned user section.
 */
function addToAssignedUser(contact) {
  let assignedUser = document.getElementById("assignedUser");
  assignedContacts.push(contact);
  renderassignedUser(assignedUser);
}

/**
 * Handles unassigning contacts from a task.
 */
function unassignContacts(contactName, checkbox) {
  checkbox.src = "./assets/img/addTask_AssignTo_Checkbox.svg";
  let selectedContactIndex = findSelectedIndex(contactName);
  selectedContacts.splice(selectedContactIndex, 1);
  removeFromAssignedList(selectedContactIndex);
}

/**
 * Finds the index of a selected contact.
 */
function findSelectedIndex(contactName) {
  return selectedContacts.findIndex(
    (contact) => contact["name"] === contactName
  );
}

/**
 * Removes a contact from the assigned list.
 */
function removeFromAssignedList(selectedContactIndex) {
  let assignedUser = document.getElementById("assignedUser");
  assignedContacts.splice(selectedContactIndex, 1);
  renderassignedUser(assignedUser);
  saveSelectedContacts();
}

/**
 * Clears assigned users and selected contacts.
 */
function clearAssignedUser() {
  assignedContacts = [];
  selectedContacts = [];
  renderassignedUser(assignedUser);
  document.querySelectorAll(".checkbox").forEach(function (checkbox) {
    checkbox.src = "./assets/img/addTask_AssignTo_Checkbox.svg";
  });
  let contactsElements = document.querySelectorAll(".assignListContact");
  contactsElements.forEach(function (contact) {
    contact.classList.remove("contactSelected");
  });
}