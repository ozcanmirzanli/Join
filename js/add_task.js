/******************************
 * Element / Global References
 ******************************/
const dropDownMenu = document.getElementById("assignToDropdown");
const assignedUser = document.getElementById("assignedUser");
const cancelSubtask = document.getElementById("cancelSubtask");
const subtasksDiv = document.getElementById("subtasks");
const plusIcon = document.getElementById("plusIcon");
const addSubtaskInput = document.getElementById("addsubtask");

/**
 * Global arrays and variables to store data.
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
    taskData = await getItem("taskData");
  } catch (e) {
    console.info("Could not load tasks");
  }
}

/**
 * Loads contact data from remote storage.
 */
async function getContact() {
  try {
    contacts = await getItem("contacts");
  } catch (error) {
    console.info("Could not load contacts");
  }
}

/**
 * Sets all priority buttons back to their default colors.
 * @param {string} priority - The priority level.
 */
function changePriorityColor(priority) {
  resetPriorityButtons();
  setPriorityButtonStyles(priority);
}

/**
 * Resets the styles of all priority buttons to their default state.
 */
function resetPriorityButtons() {
  const buttons = [
    { id: "btnPrioUrgent", img: "assets/img/urgent_red_AddTask.svg" },
    { id: "btnPrioMedium", img: "assets/img/medium_orange_AddTask.svg" },
    { id: "btnPrioLow", img: "assets/img/low_green_AddTask.svg" },
  ];

  buttons.forEach((button) => {
    const btn = document.getElementById(button.id);
    if (!btn) return;
    btn.style.backgroundColor = "#ffffff";
    btn.style.color = "#000000";
    btn.style.borderColor = "#D1D1D1";
    btn.getElementsByTagName("img")[0].src = button.img;
  });
}

/**
 * Sets the styles for the priority button based on the given priority.
 * @param {string} priority - The priority level.
 */
function setPriorityButtonStyles(priority) {
  const styles = {
    urgent: {
      backgroundColor: "#FF3D00",
      color: "#FFFFFF",
      borderColor: "#FF3D00",
      img: "assets/img/urgent_white_AddTask.svg",
      prio: "Urgent",
    },
    medium: {
      backgroundColor: "#FFA800",
      color: "#FFFFFF",
      borderColor: "#FFA800",
      img: "assets/img/medium_white_AddTask.svg",
      prio: "Medium",
    },
    low: {
      backgroundColor: "#7AE229",
      color: "#FFFFFF",
      borderColor: "#7AE229",
      img: "assets/img/low_white_AddTask.svg",
      prio: "Low",
    },
  };

  const btn = document.getElementById(
    `btnPrio${capitalizeFirstLetter(priority)}`
  );
  if (btn && styles[priority]) {
    btn.style.backgroundColor = styles[priority].backgroundColor;
    btn.style.color = styles[priority].color;
    btn.style.borderColor = styles[priority].borderColor;
    btn.getElementsByTagName("img")[0].src = styles[priority].img;
    selectedPrio = styles[priority].prio;
  }
}

/**
 * Capitalizes the first letter of the given string.
 * @param {string} string
 * @returns {string}
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Toggles the visibility of the subtasks section.
 */
function toggleSubtasks() {
  if (!subtasksDiv) return;
  if (subtasksDiv.classList.contains("d-none")) {
    subtasksDiv.classList.remove("d-none");
    plusIcon?.classList.add("d-none");
  } else {
    subtasksDiv.classList.add("d-none");
    plusIcon?.classList.remove("d-none");
  }
}

/**
 * Handles click event on cancel subtask button.
 */
function cancelSubtaskClick() {
  if (!subtasksDiv) return;
  subtasksDiv.classList.add("d-none");
  plusIcon?.classList.remove("d-none");
  addSubtaskInput.value = "";
}

/**
 * Saves a new subtask into the global array `subtask`.
 */
function saveSubtask() {
  const subtaskText = addSubtaskInput.value.trim();
  if (!subtaskText) return;

  const subtaskId = subtask.length;
  subtask.push({ id: subtaskId, content: subtaskText, completed: false });

  const showSubtasksContainer = document.getElementById("showsubtasks");
  if (showSubtasksContainer) {
    showSubtasksContainer.insertAdjacentHTML(
      "beforeend",
      renderSubtaskItem(subtaskText, subtaskId)
    );
    showSubtasksContainer.classList.remove("d-none");
  }

  addSubtaskInput.value = "";
}

/**
 * Handles subtask edit action.
 * @param {number} i - The index of the subtask to edit.
 */
function subtaskEdit(i) {
  document.getElementById(`mainBoundingBox${i}`)?.classList.add("d-none");
  document.getElementById(`subtaskContent${i}`)?.classList.add("d-none");
  document.getElementById(`subtaskEditInput${i}`)?.classList.remove("d-none");
}

/**
 * Handles subtask save edit action.
 * @param {number} i - The index of the subtask to save.
 */
function subtaskSaveEdit(i) {
  const subtaskContent = document.getElementById(`subtaskContent${i}`);
  const subtaskEditInput = document.getElementById(`subtaskEditInput${i}`);
  const subtaskInput = document.getElementById(`subtaskInput${i}`);
  document.getElementById(`mainBoundingBox${i}`)?.classList.remove("d-none");

  subtask[i].content = subtaskInput.value;
  subtaskContent.querySelector(
    "span"
  ).textContent = `\u2022 ${subtaskInput.value}`;

  subtaskContent.classList.toggle("d-none");
  subtaskEditInput.classList.toggle("d-none");
}

/**
 * Deletes a subtask from the global array `subtask`.
 * @param {number} id - The ID of the subtask to delete.
 */
function subtaskDelete(id) {
  const index = subtask.findIndex((sub) => sub.id === id);
  if (index === -1) return;

  subtask.splice(index, 1);
  document.getElementById(`subtask${id}`)?.remove();
}

/**
 * Clears all subtask entries displayed in HTML.
 */
function clearShowSubtasks() {
  const showSubtasks = document.getElementById("showsubtasks");
  while (showSubtasks?.firstChild) {
    showSubtasks.removeChild(showSubtasks.firstChild);
  }
}

/**
 * Resets the category section to default state.
 */
function resetCategorySection() {
  const categoryDropdown = document.getElementById("categoryAddTask");
  if (!categoryDropdown) return;

  categoryDropdown.selectedIndex = 0;
  categoryDropdown.style.borderColor = "#D1D1D1";
  categoryDropdown.onchange = handleCategoryChange;
}

/**
 * Toggles the assign-to dropdown menu.
 */
function toggleAssignTo(event) {
  event.stopPropagation();
  const localMenu = document.getElementById("assignToDropdown");
  if (!localMenu) return;

  if (localMenu.classList.contains("d-none")) {
    openAssignTo(localMenu);
  } else {
    closeAssignTo(localMenu);
  }
}

/**
 * Opens the assign-to dropdown menu.
 * @param {HTMLElement} menu - The dropdown menu element.
 */
function openAssignTo(menu) {
  const dropDownMenu = document.getElementById("assignToDropdown");
  if (!dropDownMenu) return;
  dropDownMenu.classList.remove("d-none");

  const assignedUserEl = document.getElementById("assignedUser");
  const arrowDown = document.getElementById("arrowdown");
  const arrowUp = document.getElementById("arrowup");
  const inputAssignedTo = document.querySelector(".input-assignedTo");
  const selectContactsText = document.getElementById("select-contacts");

  assignedUserEl?.classList.add("d-none");
  arrowDown?.classList.add("d-none");
  arrowUp?.classList.remove("d-none");

  if (inputAssignedTo) inputAssignedTo.style.border = "1px solid #29ABE2";
  if (selectContactsText) selectContactsText.innerHTML = "";

  renderContacts();
  renderAssignedContacts();
  restoreSelectedContacts();

  document.addEventListener("click", handleClickOutside);
}

/**
 * Closes the assign-to dropdown menu.
 * @param {HTMLElement} menu - The dropdown menu element.
 */
function closeAssignTo(menu) {
  const dropDownMenu = document.getElementById("assignToDropdown");
  if (!dropDownMenu) return;
  dropDownMenu.classList.add("d-none");

  const assignedUserEl = document.getElementById("assignedUser");
  const arrowDown = document.getElementById("arrowdown");
  const arrowUp = document.getElementById("arrowup");
  const inputAssignedTo = document.querySelector(".input-assignedTo");
  const selectContactsText = document.getElementById("select-contacts");

  assignedUserEl?.classList.remove("d-none");
  arrowUp?.classList.add("d-none");
  arrowDown?.classList.remove("d-none");

  if (inputAssignedTo) inputAssignedTo.style.border = "";
  if (selectContactsText)
    selectContactsText.innerHTML = "Select contacts to assign";

  document.removeEventListener("click", handleClickOutside);
}

/**
 * Renders assigned contacts to the assignedUser container.
 */
function renderAssignedContacts() {
  renderAssignedUser(assignedUser);
}

/**
 * Restores selected contacts from localStorage.
 */
function restoreSelectedContacts() {
  const selectedContactsFromStorage = localStorage.getItem("selectedContacts");
  if (!selectedContactsFromStorage) return;

  selectedContacts.forEach((contact) => {
    const index = contacts.findIndex((c) => c.name === contact.name);
    if (index !== -1) {
      const contactElement = document.getElementById(`contact${index}`);
      const checkbox = document.getElementById(`checkbox${index}`);
      contactElement?.classList.add("contactSelected");
      if (checkbox)
        checkbox.src = "./assets/img/addTask_AssignTo_Checkbox_Checked.svg";
    }
  });
}

/**
 * Renders contacts into the assign-to dropdown menu.
 */
function renderContacts() {
  const assignList = document.getElementById("assignToList");
  if (!assignList) return;
  assignList.innerHTML = "";

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    assignList.innerHTML += getassignListHTML(contact, contact.color, i);
  }
}

/**
 * Handles assigning a contact to a task.
 * @param {number} i - The index of the contact.
 * @param {string} contactName - The contact's name.
 */
function assignContact(i, contactName) {
  const contactEl = document.getElementById(`contact${i}`);
  const checkbox = document.getElementById(`checkbox${i}`);
  if (!contactEl || !checkbox) return;

  contactEl.classList.toggle("contactSelected");
  const isSelected = contactEl.classList.contains("contactSelected");

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
 * Adds an assigned contact to the assigned users array and re-renders them.
 * @param {Object} contact
 */
function addToAssignedUser(contact) {
  assignedContacts.push(contact);
  renderAssignedUser(assignedUser);
}

/**
 * Handles unassigning a contact from a task.
 * @param {string} contactName
 * @param {HTMLImageElement} checkbox
 */
function unassignContacts(contactName, checkbox) {
  checkbox.src = "./assets/img/addTask_AssignTo_Checkbox.svg";
  const selectedContactIndex = findSelectedIndex(contactName);
  selectedContacts.splice(selectedContactIndex, 1);
  removeFromAssignedList(selectedContactIndex);
}

/**
 * Finds the index of a selected contact.
 * @param {string} contactName
 * @returns {number} - The index in selectedContacts.
 */
function findSelectedIndex(contactName) {
  return selectedContacts.findIndex((contact) => contact.name === contactName);
}

/**
 * Removes a contact from the assigned list array.
 * @param {number} selectedContactIndex
 */
function removeFromAssignedList(selectedContactIndex) {
  assignedContacts.splice(selectedContactIndex, 1);
  renderAssignedUser(assignedUser);
  saveSelectedContacts();
}

/**
 * Clears assigned users and selected contacts.
 */
function clearAssignedUser() {
  assignedContacts = [];
  selectedContacts = [];
  renderAssignedUser(assignedUser);

  document.querySelectorAll(".checkbox").forEach((checkbox) => {
    checkbox.src = "./assets/img/addTask_AssignTo_Checkbox.svg";
  });
  document.querySelectorAll(".assignListContact").forEach((contact) => {
    contact.classList.remove("contactSelected");
  });
}

/**
 * Renders HTML for a subtask item.
 * @param {string} subtaskText - The subtask content.
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML code for the subtask item.
 */
function renderSubtaskItem(subtaskText, i) {
  return /*html*/ `
    <div class="subtask-item" id="subtask${i}">
      <div class="subtask-content" id="subtaskContent${i}">
        <span>\u2022 ${subtaskText}</span>
      </div>
      <div id="subtaskEditInput${i}" class="subtask-content d-none">
        <input 
          value="${subtaskText}" 
          class="subtask-input subtaskEditText" 
          id="subtaskInput${i}"
        >
        <div class="subtask-bounding-box">
          <img 
            onclick="subtaskDelete(${i})" 
            src="assets/img/subtask_trash_AddTask.svg" 
            alt="Delete Subtask" 
            class="subtask-icon"
          >
          <img 
            src="assets/img/subtask_seperator_AddTask.svg" 
            alt="Separator" 
            class="subtask-icon"
          >
          <img 
            onclick="subtaskSaveEdit(${i})" 
            src="assets/img/subtask_check_AddTask.svg" 
            alt="Check Subtask" 
            class="subtask-icon"
          >
        </div>
      </div>
      <div id="mainBoundingBox${i}" class="subtask-bounding-box">
        <img 
          onclick="subtaskEdit(${i})" 
          src="assets/img/subtask_edit_AddTask.svg" 
          alt="Edit Subtask" 
          class="subtask-icon"
        >
        <img 
          src="assets/img/subtask_seperator_AddTask.svg" 
          alt="Separator" 
          class="subtask-icon"
        >
        <img 
          onclick="subtaskDelete(${i})" 
          src="assets/img/subtask_trash_AddTask.svg" 
          alt="Delete Subtask" 
          class="subtask-icon"
        >
      </div>
    </div>
  `;
}

/**
 * Generates HTML for a contact in the assign-to dropdown menu.
 */
function getassignListHTML(contact, badgeColor, i) {
  return /*html*/ `
    <div 
      class="assignListContact" 
      id="contact${i}" 
      onclick="assignContact(${i}, '${contact.name}')"
    >
      <div class="assignDetails">
        <div class="assignToBadge" style="background-color: ${badgeColor}">
          ${contact.initials}
        </div>
        <div>${contact.name}</div>
      </div>
      <img 
        id="checkbox${i}" 
        src="./assets/img/addTask_AssignTo_Checkbox.svg" 
        class="checkbox"
      >
    </div>
  `;
}

/**
 * Renders assigned contacts in the assignedUser container.
 */
function renderAssignedUser(assignedUserContainer) {
  if (!assignedUserContainer) return;
  assignedUserContainer.innerHTML = "";
  assignedContacts.forEach((assignedContact) => {
    assignedUserContainer.innerHTML += `
      <div 
        class="assignToBadge" 
        style="background-color: ${assignedContact.color}"
      >
        ${assignedContact.initials}
      </div>
    `;
  });
}

/**
 * Saves selected contacts to local storage.
 */
function saveSelectedContacts() {
  // If you're storing objects, typically:
  // localStorage.setItem("selectedContacts", JSON.stringify(selectedContacts));
  localStorage.setItem("selectedContacts", selectedContacts);
}

/**
 * Handles category dropdown change.
 * @param {HTMLSelectElement} selectElement
 */
function handleCategoryChange(selectElement) {
  // Add your logic here if needed
}

/**
 * Handles clicks outside the assign dropdown to close it.
 */
function handleClickOutside(event) {
  const assignAddTask = document.getElementById("assignAddTask");
  const assignToDropdown = document.getElementById("assignToDropdown");
  if (!assignAddTask || !assignToDropdown) return;

  if (
    !assignAddTask.contains(event.target) &&
    !assignToDropdown.contains(event.target)
  ) {
    closeAssignTo(assignToDropdown);
  }
}
