/**
 * Sets up event listeners for focus and blur events on the input element.
 */
document.addEventListener("DOMContentLoaded", function () {
  var addSubtaskInput = document.getElementById("addsubtask");

  // Setting up the event listeners for focus and blur events
  addSubtaskInput.addEventListener("focus", handleFocus);
  addSubtaskInput.addEventListener("blur", handleBlur);
});

/**
 * Global array to store data.
 * @type {Array<Object>}
 */
let subtask = [];
let taskData = [];
let taskIdCounter = 0;
let selectedPrio = "";
let newTask = [];
let users = [];
let contacts = [];
let selectedContacts = [];
let assignedContacts = [];

/**
 * Initializes the application side.
 */
async function init() {
  includeHTML();
  await loadTasksData();
  await loadUsers();
  await getContact();
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
    selectedPrio = "urgent";
  } else if (priority === "medium") {
    document.getElementById("btnPrioMedium").style.backgroundColor = "#FFA800";
    document.getElementById("btnPrioMedium").style.color = "#FFFFFF";
    document.getElementById("btnPrioMedium").style.borderColor = "#FFA800";
    document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src ="assets/img/medium_white_AddTask.svg";
    selectedPrio = "medium";
  } else if (priority === "low") {
    document.getElementById("btnPrioLow").style.backgroundColor = "#7AE229";
    document.getElementById("btnPrioLow").style.color = "#FFFFFF";
    document.getElementById("btnPrioLow").style.borderColor = "#7AE229";
    document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src ="assets/img/low_white_AddTask.svg";
    selectedPrio = "low";
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
    document.getElementById("dueDate").value = ""; // Zurücksetzen des Eingabefelds
  }
}

/**
 * Handles category change.
 *
 * @param {HTMLSelectElement} selectElement - The select element.
 */
function handleCategoryChange(selectElement) {
  var selectedCategory = selectElement.value;
  // Hier können Sie die gewählte Kategorie weiterverarbeiten, z. B. sie in einer Variable speichern oder eine Funktion aufrufen
  console.log("Selected category: " + selectedCategory);
}

/**
 * Changes the border color of a container.
 */
function changeBorderColor() {
  let categoryContainer = document.getElementById("categoryContainer");
  categoryContainer.style.borderColor = "rgba(41, 171, 226, 1)";
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
  const cancelSubtask = document.getElementById("cancelSubtask");

  subtasksDiv.classList.add("d-none");
  plusIcon.classList.remove("d-none");
}

/**
 * Handles input focus event.
 */
function handleInputFocus() {
  let subtasksInput = document.querySelector("addSubtaskMain");
  subtasksInput.style.borderColor = "rgba(41, 171, 226, 1)";
}

/**
 * Saves a new subtask and push subtask into subtask global arra.
 * Improve better handover to remote storage array taskData.
 */
function saveSubtask() {
  let subtaskInput = document.getElementById("addsubtask");
  let subtaskText = subtaskInput.value;

  if (subtaskText !== "") {
    // Erstellen einer eindeutigen ID für den Subtask
    let subtaskId = subtask.length;
    // Hinzufügen des Subtasks zum globalen Array
    subtask.push({ id: subtaskId, content: subtaskText, completed: false });

    // Erstellen des HTML-Codes für den Subtask
    const subtaskHTML = renderSubtaskItem(subtaskText, subtaskId);

    // Hinzufügen des Subtask-HTML-Codes zum Element mit der ID 'showsubtasks'
    const showSubtasksContainer = document.getElementById("showsubtasks");
    showSubtasksContainer.insertAdjacentHTML("beforeend", subtaskHTML);

    // Clear subtask input
    subtaskInput.value = "";

    // Anzeigen der Subtasks
    showSubtasksContainer.classList.remove("d-none");
  }
}

/**
 * Renders HTML for a subtask item.
 *
 * @param {string} subtask - The subtask content.
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML code for the subtask item.
 */
function renderSubtaskItem(subtask, i) {
  return `
      <div class="subtask-item">
          <div id="subtask${i}" class="subtask-content">
              <span>\u2022 ${subtask}</span>
          </div>
          <div id="subtaskEditInput${i}" class="subtask-content d-none">
              <input value="${subtask}" class="subtask-input subtaskEditText" id="subtaskInput${i}">
              <div class="subtask-bounding-box">
                  <img onclick="subtaskDelete(${i})" src="assets/img/subtask_trash_AddTask.svg" alt="Delete Subtask" class="subtask-icon">
                  <img src="assets/img/subtask_seperator_AddTask.svg" alt="Separator" class="subtask-icon">
                  <img onclick="subtaskSaveEdit(${i})" src="assets/img/subtask_check_AddTask.svg" alt="Check Subtask" class="subtask-icon">
              </div>
          </div>
          <div id="mainBoundingBox${i}" class="subtask-bounding-box">
              <img onclick="subtaskEdit(${i})" src="assets/img/subtask_edit_AddTask.svg" alt="Edit Subtask" class="subtask-icon">
              <img src="assets/img/subtask_seperator_AddTask.svg" alt="Separator" class="subtask-icon">
              <img onclick="subtaskDelete(${i})" src="assets/img/subtask_trash_AddTask.svg" alt="Delete Subtask" class="subtask-icon">
          </div>
      </div>
  `;
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
  // Finden des Index des Subtasks im globalen Array anhand seiner ID
  let index = subtask.findIndex(sub => sub.id === id);

  // Überprüfen, ob der Subtask gefunden wurde
  if (index !== -1) {
    // Löschen des Subtasks aus dem globalen Array
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
  // Clear-Eingaben für die Titel-Section
  document.getElementById("titleAddTask").value = "";
  // Clear-Eingaben für die Description-Section
  document.querySelector(".padding-description textarea").value = "";
  // Clear-Eingaben für die Assigned To-Section
  clearAssignedUser();
  // Clear-Eingaben für die Due Date-Section
  document.getElementById("dueDate").value = "";
  // Clear-Eingaben für die Priority-Section
  resetPriorityButtons();
  // Clear-Eingaben für die Category-Section
  resetCategorySection();
  // Clear-Eingaben für die Subtasks-Section
  document.getElementById("addsubtask").value = "";
  // Clear-Einträge in der Show Subtasks-Section
  clearShowSubtasks();
  subtaskDelete();
}

/**
 * Clears all subtask entries displayed in HTML.
 */
function clearShowSubtasks() {
  const showSubtasks = document.getElementById("showsubtasks");
  // Lösche alle untergeordneten Elemente der showSubtasks-DIV
  while (showSubtasks.firstChild) {
    showSubtasks.removeChild(showSubtasks.firstChild);
  }
}

/**
 * Resets priority buttons to default state.
 */
function resetPriorityButtons() {
  // Array mit den IDs der Priority-Buttons und ihren Standardbildern
  const priorityButtons = [
    { id: "btnPrioUrgent", imgSrc: "assets/img/urgent_red_AddTask.svg" },
    { id: "btnPrioMedium", imgSrc: "assets/img/medium_orange_AddTask.svg" },
    { id: "btnPrioLow", imgSrc: "assets/img/low_green_AddTask.svg" },
  ];

  // Schleife über alle Button-IDs
  priorityButtons.forEach((button) => {
    const buttonElement = document.getElementById(button.id);
    // Zurücksetzen der Hintergrundfarbe
    buttonElement.style.backgroundColor = "rgba(255, 255, 255, 1)";
    // Zurücksetzen der Border Color
    buttonElement.style.borderColor = "#D1D1D1";
    // Zurücksetzen der Schriftfarbe
    buttonElement.style.color = "rgba(0, 0, 0, 1)";
    // Zurücksetzen des Bildes
    const imgElement = buttonElement.querySelector("img");
    imgElement.src = button.imgSrc;
  });
}

/**
 * Resets the category section to default state.
 */
function resetCategorySection() {
  const categoryDropdown = document.getElementById("categoryAddTask");
  // Setze den ausgewählten Index auf den Index des `<option>`-Elements mit dem Wert ""
  categoryDropdown.selectedIndex = 0;
  // Setze die Border Color zurück
  categoryDropdown.style.borderColor = "#D1D1D1";
  // Füge das onchange-Event wieder hinzu
  categoryDropdown.onchange = handleCategoryChange;
}

/**
 * Creates a new task for remote storage array taskData.
 */
async function createTask() {
  // Erforderliche Felder prüfen
  let title = document.getElementById("titleAddTask").value;
  let dueDate = document.getElementById("dueDate").value;

  if (title === "" || dueDate === "") {
    alert("Please fill in all required fields.");
    return;
  }
  let subTasks = subtask;

  taskData.push({
    id: taskIdCounter++,
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

  // taskData.push(newTask);
  clearEntries();

  // JSON-Array ausgeben (nur für Debugging-Zwecke)
  // console.log(taskData);
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
 * Loads user data from remote storage.
 */
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
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
  // Laden der ausgewählten Kontakte aus dem Local Storage
  try {
    selectedContacts =
      JSON.parse(localStorage.getItem("selectedContacts")) || [];
  } catch (error) {
    console.info("Could not load selected contacts");
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
 * Generates HTML for a contact in the assign to dropdown menu.
 */
function getassignListHTML(contact, badgeColor, i) {
  return /*HTML*/ `
            <div class="assignListContact" id="contact${i}" onclick="assignContact(${i}, '${contact.name}', '${contact.initials}')">
                <div class="assignDetails">
                    <div class="assignToBadge" style="background-color: ${badgeColor}">${contact.initials}</div>
                    <div>${contact.name}</div>
                </div>
                <img id="checkbox${i}" src="./assets/img/addTask_AssignTo_Checkbox.svg" class="checkbox">
            </div>
            `;
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
    selectedContacts.push(contacts[i]) - 1;
    addToAssignedUser(i, contacts[i]);
  } else {
    unassignContacts(contactName, checkbox);
  }
  saveSelectedContacts();
}

/**
 * Adds assigned contact to assigned user section.
 */
function addToAssignedUser(i) {
  let assignedUser = document.getElementById("assignedUser");
  let assignedContact = selectedContacts[i];
  assignedContacts.push(assignedContact);
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
 * Renders assigned users.
 */
function renderassignedUser(assignedUser) {
  assignedUser.innerHTML = "";
  assignedContacts.forEach((assignedContact) => {
    let badgeColor = assignedContact.color;
    assignedUser.innerHTML += `
            <div class="assignToBadge" style="background-color: ${badgeColor}">${assignedContact.initials}</div>
        `;
  });
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
  document
    .querySelectorAll(".assignListContact")
    .forEach(function (dropDownContact) {
      dropDownContact.classList.remove("contactSelected");
    });
  closeAssignTo();
  saveSelectedContacts();
}

/**
 * Handles focus event on input elements by setting a custom border color.
 */
function handleFocus(event) {
  if (event.target.tagName === "INPUT") {
    event.target.parentElement.style.border = "1px solid #29ABE2";
  }
}

/**
 * Handles blur event on input elements by resetting the border color.
 */
function handleBlur(event) {
  if (event.target.tagName === "INPUT") {
    event.target.parentElement.style.border = "";
  }
}
