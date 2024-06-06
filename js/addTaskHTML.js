/**
 * Renders HTML for a subtask item.
 *
 * @param {string} subtask - The subtask content.
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML code for the subtask item.
 */
function renderSubtaskItem(subtask, i) {
    return /*HTML*/ `
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