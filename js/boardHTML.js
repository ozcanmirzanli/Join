/**
 * Generates HTML for a todo element.
 * @param {Object} element - The todo object.
 * @returns {string} - The HTML string representing the todo element.
 */
function generateTodoHTMLBoard(element) {
    let categoryStyle = getCategoryStyle(element.category); 
    let assignTo = '';
    let zIndex = 1; 

    if (element["assignTo"] && element["assignTo"].length > 0) {
        for (let j = 0; j < element["assignTo"].length; j++) {
            let member = element["assignTo"][j];
            const marginLeft = j !== 0 ? 'margin-left: -10%;' : ''; 
            if (member) {
                assignTo += `<div class="initialsMini" style="z-index: ${zIndex++}; ${marginLeft}; background-color: ${member.color}">${member.initials}</div>`;
            }
        }
    }

    let progressBarHTML = '';
    if (element['subTasks'].length > 0) {
        let progressBarId = `progress-bar-${element.id}`;
        let completedSubtasksCount = element.subTasks.filter(subtask => subtask.completed).length;
        let totalSubtasksCount = element.subTasks.length;
        let taskCounterText = `${completedSubtasksCount}/${totalSubtasksCount} Subtasks`;
        progressBarHTML = /*html*/ `
            <div class="TaskProgressbar" role="progressbar">
                <div id="${progressBarId}" class="progressbar">
                    <div class="progress-bar"></div>
                </div>
                <div class="Taskcounter">${taskCounterText}</div>
            </div>
        `;
        setTimeout(() => updateProgressBar(element), 0);
    }

    return /*html*/ `
        <div draggable="true" ondrag="startDragging(${element.id})" class="userStoryMini" onclick="openTask(${element.id})"> 
            <div class="taskCategory" style="background-color: ${categoryStyle.color}; width: ${categoryStyle.width};">${element.category}</div>
            <div class="headerStoryMini">
                <div class="taskTitleMini">${element.title}</div>
                <div class="taskDescription">${element.description}</div>
            </div>
            ${progressBarHTML}
            <div class="taskFooter">
                <div class="badgesMini">${assignTo}</div>
                <img src="./assets/img/${element['priority']}_priority.svg" alt="" class="taskPriority">
            </div>
        </div>
    `;
}


/**
 * Returns the background color and width based on the category.
 * @param {string} category - The category of the task.
 * @returns {Object} - An object containing the background color and width.
 */
function getCategoryStyle(category) {
    if (category === 'Technical Story') {
        return { color: 'rgba(31, 215, 193, 1)', width: '120px' }; // Set the desired color and width for Technical Story
    } else if (category === 'User Story') {
        return { color: 'rgba(0, 56, 255, 1)', width: '90px' }; // Set the desired color and width for User Story
    }
    return { color: 'white', width: 'auto' }; // Default color and width if the category doesn't match
}
  
 /**
 * Renders a big task with detailed information.
 * @param {Object} task - The task object to render.
 */
function renderBigTask(task) {
    let subtasks = '';
    let taskIndex = task["id"];
    if (task['subTasks'] && task['subTasks'].length > 0) {
        for (let i = 0; i < task["subTasks"].length; i++) {
            let subTaskIndex = task["subTasks"][i];
            let imgSrc = subTaskIndex["completed"] ? "./assets/img/check-box-checked.png" : "./assets/img/check-box-disabled.png";
            subtasks += /*html*/ `
                <div class="subtaskContent">
                    <div><img src="${imgSrc}" alt="" id="subTaskCheckBox" onclick="changeCompletedBoard(${taskIndex}, ${i})"></div>
                    <div>${subTaskIndex["content"]}</div>
                </div>
            `;
        }
    }
    let assignTo = '';
    if (task["assignTo"] && task["assignTo"].length > 0) {
        for (let j = 0; j < task["assignTo"].length; j++) {
            let memberId = task["assignTo"][j];
            if (memberId) {
                assignTo += `<div class="userTask"><div class="initialsBig" style="background-color: ${memberId["color"]}">${memberId["initials"]}</div>${memberId["name"]}</div>`;
            }
        }
    }
    document.getElementById("taskBig").classList.remove("d-none");
    let categoryStyle = getCategoryStyle(task["category"]);
    const BigTaskHTML = /*html*/ `
        <div class="bigTask">
            <div class="bigTaskContent">  
                <div class="flexBetweenCenter">
                    <div class="bigTaskCategory" style="background-color: ${categoryStyle.color}; width: ${categoryStyle.width};">${task["category"]}</div> 
                    <img src="./assets/img/Close.png" alt="" onclick="closeTaskBig()">
                </div>
                <div class="taskTitle">${task["title"]}</div>
                <div class="bigTaskDescription">${task["description"]}</div>
                <div class="bigTaskSections">    
                    <div class="bigTaskColor">Due date:</div>
                    <div>${task["dueDate"]}</div>
                </div>
                <div class="bigTaskSections">
                    <div class="bigTaskColor">Priority:</div>
                    <div class="bigTaskPrio">
                        <div>${task['priority']}</div>
                        <div><img src="./assets/img/${task['priority']}_priority.svg" alt=""></div>
                    </div>
                </div>
                <div class="members">
                    <div class="bigTaskColor">Assigned To:</div>
                    <div>${assignTo}</div>
                </div>
                <div class="subTask">
                    <div class="bigTaskColor">Subtasks:</div>
                    <div>${subtasks}</div>
                </div>
                <footer class="taskfooter">
                    <div class="iconTask" onclick="deleteTaskBoard(${task["id"]})">
                        <img src="./assets/img/delete.png" alt="delete">Delete
                    </div>
                    <div class="iconTask" onclick="editTask(${task["id"]})">
                        <img src="./assets/img/edit.svg" alt="edit">Edit
                    </div>
                </footer>
            </div>
        </div>
    `;
    document.getElementById("taskBig").innerHTML = BigTaskHTML;
}
  
/**
 * Toggles the completion status of a subtask, updates the task display, 
 * and saves the updated subtask data.
 * 
 * @param {number} taskIndex - The index of the task in the taskData array.
 * @param {number} subTaskIndex - The index of the subtask within the task's subTasks array.
 */
function changeCompletedBoard(taskIndex, subTaskIndex) {
    const subTask = taskData[taskIndex].subTasks[subTaskIndex];
    subTask.completed = !subTask.completed;
    renderBigTask(taskData[taskIndex]);
    saveSubtaskBoard(taskData[taskIndex]["id"], taskData[taskIndex]["subTasks"]);
    updateProgressBar(taskData[taskIndex]);
    changeCompletedBoard(taskData[taskIndex]);
}

/**
 * Renders the add task form.
 * @returns {string} - The HTML for the add task form.
 */
function renderAddTaskForm() {
  return /*html*/ `
        <div class="dialog-content">
            <div id="addTaskForm">
                <div class="cardHeadlinecontainer" >
                    <div class="cardHeadLine">Add Task</div>
                    <img src="assets/img/subtask_cancel_AddTask.svg" alt="Close Task" onclick="closeAddTaskDialog()" id="closeDialogBTN">
                </div>

                <div class="mainAddTaskContainer">
                    <div class="leftAddTaskMini">
                        <!-- Title -->
                        <section class="input-parts-addTask">
                            <div class="pd-bottom"><span>Title<span class="required-addTask">*</span></span></div>
                            <input id="titleAddTask" type="text" placeholder="Enter a Title" required class="border-input-addtask"/>
                        </section>

                        <!-- Description -->
                        <section class="padding-description">
                            <div class="pd-bottom"><span>Description</span></div>
                            <textarea name="description" id="descriptionAddTask" cols="30" rows="10" placeholder="Enter a Description" class="textareadAddTaskMini"></textarea>
                        </section>

                        <!-- Assigend To -->
                        <section class="padding-description">
                            <div class="pd-bottom"><label>Assigned to</label></div>
                            <div class="">
                                <div id="assignAddTask" name="assignTo" class="input-assignedTo width440">
                                    <span id="select-contacts">Select contacts to assign</span>
                                    <img class="assignToDDArrow" src="assets/img/arrow_drop_down_AddTask.svg" onclick="openAssignTo()" id="arrowdown" alt="arrowdown"/>
                                    <img src="assets/img/arrow_drop_down_AddTask.svg" onclick="closeAssignTo()" id="arrowup" alt="arrowup"  class="assignToDDArrow rotate d-none"/>
                                </div>
                            </div>
                            <div id="assignToDropdown" class="assignToDropdown assignField d-none">
                                <div id="assignToList" class="assignToDropDownMenu"></div>
                            </div>
                            <div id="assignedUser" class="assignedUserList"></div>
                        </section>
                    </div>

                    <!-- Seperator -->
                    <div><img src="assets/img/seperator_AddTask.svg" alt="seperator" id="seperator"/></div>

                    <!-- Right Part of Add Task -->
                    <div class="rightAddTaskMini">
                        <!-- Due Date -->
                        <section>
                            <div class="pd-bottom"><span>Due Date<span class="required-addTask">*</span></span></div>
                            <input id="dueDate" type="date" placeholder="yyyy/mm/dd" class="input-dueDate border-input-addtask" onchange="checkDueDate()" required/>
                        </section>

                        <!-- Priority -->
                        <section class="padding-prio">
                            <div class="pd-bottom"><span>Prio</span></div>
                            <div class="priority">
                            <button type="button" class="button-prio" id="btnPrioUrgent" onclick="changePriorityColor('urgent')">Urgent
                                <img src="assets/img/urgent_red_AddTask.svg" alt="urgent_red_AddTask"/>
                            </button>                    
                            <button type="button" class="button-prio" id="btnPrioMedium" onclick="changePriorityColor('medium')">Medium
                                <img src="assets/img/medium_orange_AddTask.svg" alt="medium_orange_AddTask"/>
                            </button>                    
                            <button type="button" class="button-prio" id="btnPrioLow" onclick="changePriorityColor('low')">Low
                                <img src="assets/img/low_green_AddTask.svg" alt="low_green_AddTask"/>
                            </button>                    
                            </div>
                        </section>

                        <!-- Category -->
                        <section class="padding-category">
                            <div class="pd-bottom"><span>Category<span class="required-addTask">*</span></span></div>
                            <div class="input-assignedTo border-input-addtask width440">
                                <select title="category" id="categoryAddTask" class="input-category " onchange="handleCategoryChange(this)" onclick="changeBorderColor()">
                                    <option value="" selected disabled>Select Task Category</option>
                                    <option value="User Story">User Story</option>
                                    <option value="Technical Story">Technical Story</option>
                                </select>
                            </div>
                        </section> 

                        <!-- Subtasks -->
                        <section class="sectionSubtasks">
                            <div class="pd-bottom"><span>Subtasks</span></div>
                            <div class="input-assignedTo border-input-addtask width440" id="addSubtaskMain" onfocus="handleInputFocus()">
                                <input id="addsubtask" type="text" placeholder="Add new subtasks" class="input-assignedTo border-none">
                                <div onclick="toggleSubtasks()" class="drop-down-image drop-down-subtask">
                                    <img id="plusIcon" src="assets/img/plus_addTask.svg" alt="plus_addTask">
                                </div>
                                <div id="subtasks" class="d-none add-subtasks">
                                    <img onclick="cancelSubtaskClick()" id="cancelSubtask" src="assets/img/subtask_cancel_AddTask.svg" class="subtasks" alt="subtask_cancel_AddTask">
                                    <img src="assets/img/subtask_seperator_AddTask.svg" alt="subtask_seperator_AddTask">
                                    <img onclick="saveSubtask()" id="checkSubtask" src="assets/img/subtask_check_AddTask.svg" class="subtasks" alt="subtask_check_AddTask">
                                </div>
                            </div>
                            <div id="showsubtasks" class="subtasks-list d-none"></div>
                        </section>
                    </div>
                </div>

                <!-- Footer AddTask -->
                <footer class="addtask-footer">
                    <div id="requiredFooter">
                        <span class="required-addTask">*</span>
                        This field is required
                    </div>

                    <div class="footer-btn-addTask">
                        <button onclick="clearEntries()" class="footer-btn-text-img" type="button" id="clear-btn">
                            Clear
                            <img src="assets/img/subtask_cancel_AddTask.svg" alt="subtask_cancel_AddTask">
                        </button>

                        <button onclick="createTask()" class="footer-btn-text-img" type="button" id="create-btn">
                            Create Task
                            <img src="assets/img/create_hook_white_AddTask.svg" alt="create_hook_white_AddTask">
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    `;
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
 * Renders the edit task form.
 * @param {Object} todo - The task object to edit.
 */
function renderEditTaskForm(todo) {
    document.getElementById("taskBig").classList.remove("d-none");
    let assignTo = '';
    if (todo["assignTo"] && todo["assignTo"].length > 0) {
        for (let j = 0; j < todo["assignTo"].length; j++) {
            let memberId = todo["assignTo"][j];
            if (memberId) {
                assignTo += `<div class="initialsBig" style="background-color: ${memberId["color"]}">${memberId["initials"]}</div>`;
            }
        }
    }
    document.getElementById("taskBig").innerHTML = /*html*/ `
      <div class="bigTask">
          <div class="bigEditTaskContent">
              <section class="btnCloseEditTaks">
                  <img src="./assets/img/Close.png" alt="" onclick="closeTaskBig()">
              </section>
              <section class="input-parts-addTask">
                  <div class="pd-bottom"><span>Title<span class="required-addTask">*</span></span></div>
                  <input id="titleAddTask" type="text" placeholder="Enter a Title" required class="border-input-addtask" value="${todo.title}"/>
              </section>
              <!-- Description -->
              <section class="padding-description">
                  <div class="pd-bottom"><span>Description</span></div>
                  <textarea name="description" id="descriptionAddTask" cols="30" rows="10" placeholder="Enter a Description" class="border-input-addtask">${todo.description}</textarea>
              </section>
              <!-- Assigned To -->
              <section class="padding-description">
                  <div class="pd-bottom"><label>Assigned to</label></div>
                  <div class="">
                      <div id="assignAddTask" name="assignTo" class="input-assignedTo">
                          <span id="select-contacts">Select contacts to assign</span>
                          <img class="assignToDDArrow" src="assets/img/arrow_drop_down_AddTask.svg" onclick="openAssignToBoard()" id="arrowdown" alt="arrowdown"/>
                          <img src="assets/img/arrow_drop_down_AddTask.svg" onclick="closeAssignTo()" id="arrowup" alt="arrowup"  class="assignToDDArrow rotate d-none"/>
                      </div>
                  </div>
                  <div id="assignToDropdown" class="assignToDropdown assignField d-none">
                      <div id="assignToList" class="assignToDropDownMenu"></div>
                  </div>
                  <div id="assignedUser" class="assignedUserList">
                  ${assignTo}
                  </div>
              </section>
              <!-- Due Date -->
              <section>
                  <div class="pd-bottom">
                  <span>Due Date<span class="required-addTask">*</span></span>
                  </div>
                  <input id="dueDate" type="date" placeholder="yyyy/mm/dd" class="input-dueDate border-input-addtask" value="${todo.dueDate}" required/>
              </section>
              <!-- Priority -->
              <section class="padding-prio">
                  <div class="pd-bottom"><span>Prio</span></div>
                  <div class="priority">
                      <button type="button" class="button-prio" id="btnPrioUrgent" onclick="changePriorityColor('urgent')" style="${todo.priority === 'Urgent' ? 'background-color: #FF3D00; color: #FFFFFF;' : ''}">Urgent
                          <img id="imgPrioUrgent" src="${todo.priority === 'Urgent' ? 'assets/img/urgent_white_AddTask.svg' : 'assets/img/urgent_red_AddTask.svg'}" alt="urgent_red_AddTask"/>
                      </button>                    
                      <button type="button" class="button-prio" id="btnPrioMedium" onclick="changePriorityColor('medium')" style="${todo.priority === 'Medium' ? 'background-color: #FFA800; color: #FFFFFF;' : ''}">Medium
                          <img id="imgPrioMedium" src="${todo.priority === 'Medium' ? 'assets/img/medium_white_AddTask.svg' : 'assets/img/medium_orange_AddTask.svg'}" alt="medium_orange_AddTask"/>
                      </button>                    
                      <button type="button" class="button-prio" id="btnPrioLow" onclick="changePriorityColor('low')" style="${todo.priority === 'Low' ? 'background-color: #7AE229; color: #FFFFFF;' : ''}">Low
                          <img id="imgPrioLow" src="${todo.priority === 'Low' ? 'assets/img/low_white_AddTask.svg' : 'assets/img/low_green_AddTask.svg'}" alt="low_green_AddTask"/>
                      </button>                    
                  </div>
              </section>
              <!-- Category -->
              <section class="padding-category">
                  <div class="pd-bottom">
                      <span>Category<span class="required-addTask">*</span></span>
                  </div>
                  <div class="input-assignedTo border-input-addtask" id="categoryContainer">
                      <select title="category" id="categoryAddTask" class="input-category" onchange="handleCategoryChange(this)">
                          <option value="" selected disabled>Select Task Category</option>
                          <option class="input-option" value="User Story" ${todo.category === 'User Story' ? 'selected' : ''}>User Story</option>
                          <option class="input-option" value="Technical Story" ${todo.category === 'Technical Story' ? 'selected' : ''}>Technical Story</option>
                      </select>
                  </div>
              </section>
               <!-- Subtasks -->
               <section>
                <div class="pd-bottom"><span>Subtasks</span></div>
                <div class="input-assignedTo border-input-addtask" id="addSubtaskMain" onfocus="handleInputFocus()">
                    <input id="addsubtask" type="text" placeholder="Add new subtasks" class="input-assignedTo border-none">
                    <div onclick="toggleSubtasks()" class="drop-down-image drop-down-subtask">
                        <img id="plusIcon" src="assets/img/plus_addTask.svg" alt="plus_addTask">
                    </div>
                    <div id="subtasks" class="d-none add-subtasks">
                        <img onclick="cancelSubtaskClick()" id="cancelSubtask" src="assets/img/subtask_cancel_AddTask.svg" class="subtasks" alt="subtask_cancel_AddTask">
                        <img src="assets/img/subtask_seperator_AddTask.svg" alt="subtask_seperator_AddTask">
                        <img onclick="saveSubtask()" id="checkSubtask" src="assets/img/subtask_check_AddTask.svg" class="subtasks" alt="subtask_check_AddTask">
                    </div>
                </div>
                ${todo.subTasks.map((subtask, index) => `
                <div class="subtask-item">
                  <div id="subtask${index}" class="subtask-content">
                      <span>\u2022 ${subtask.content}</span>
                  </div>
                  <div id="subtaskEditInput${index}" class="subtask-content d-none">
                      <input value="${subtask.content}" class="subtask-input subtaskEditText" id="subtaskInput${index}">
                      <div class="subtask-bounding-box">
                          <img onclick="subtaskDelete(${index})" src="assets/img/subtask_trash_AddTask.svg" alt="Delete Subtask" class="subtask-icon">
                          <img src="assets/img/subtask_seperator_AddTask.svg" alt="Separator" class="subtask-icon">
                          <img onclick="subtaskSaveEdit(${index})" src="assets/img/subtask_check_AddTask.svg" alt="Check Subtask" class="subtask-icon">
                      </div>
                  </div>
                  <div id="mainBoundingBox${index}" class="subtask-bounding-box">
                      <img onclick="subtaskEdit(${index})" src="assets/img/subtask_edit_AddTask.svg" alt="Edit Subtask" class="subtask-icon">
                      <img src="assets/img/subtask_seperator_AddTask.svg" alt="Separator" class="subtask-icon">
                      <img onclick="subtaskDelete(${index})" src="assets/img/subtask_trash_AddTask.svg" alt="Delete Subtask" class="subtask-icon">
                  </div>
                </div>
                `).join('')}
            </section>
            <footer class="editTaskFooter">
                <button onclick="saveTaskBoard(${todo.id})" class="addTaskBtn" type="button" id="addTaskBtn">
                    Ok
                    <img src="./assets/img/board_addTask_button_check.svg" alt="addTask_Button_Board_Plus">
                </button>
            </footer>
        </div>
    </div>
  `;
}

/**
 * Generates HTML for a contact list item in the "Assign To" dropdown menu.
 * 
 * @param {Object} contact - The contact object.
 * @param {string} badgeColor - The color of the contact's badge.
 * @param {number} i - The index of the contact.
 * @returns {string} - The HTML string for the contact list item.
 */
function getassignListHTMLBoard(contact, badgeColor, i) {
    return /*HTML*/ `
              <div class="assignListContact" id="contact${i}" onclick="assignContactBoard(${i}, '${contact.name}', '${contact.initials}')">
                  <div class="assignDetails">
                      <div class="assignToBadge" style="background-color: ${badgeColor}">${contact.initials}</div>
                      <div>${contact.name}</div>
                  </div>
                  <img id="checkbox${i}" src="./assets/img/addTask_AssignTo_Checkbox.svg" class="checkbox">
              </div>
              `;
  }

  /**
 * Renders the assigned users in the "Assigned To" section.
 * 
 * @param {HTMLElement} assignedUser - The HTML element to render the assigned users in.
 */
function renderAssignedUserBoard(assignedUser) {
    assignedUser.innerHTML = "";
    assignedContacts.forEach((assignedContact) => {
      let badgeColor = assignedContact.color;
      assignedUser.innerHTML += `
              <div class="assignToBadge" style="background-color: ${badgeColor}">${assignedContact.initials}</div>
          `;
    });
  }