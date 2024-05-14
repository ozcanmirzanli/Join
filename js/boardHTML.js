/**
 * Generates HTML for a todo element.
 * @param {Object} element - The todo object.
 * @returns {string} - The HTML string representing the todo element.
 */
function generateTodoHTML(element) {
 
    if (taskData['subTasks']) {
        let progressBarId = `progress-bar-${element.id}`;
        let completedSubtasksCount = element.subTasks.filter(subtask => subtask.completed).length;
    let totalSubtasksCount = element.subTasks.length;
    let taskCounterText = `${completedSubtasksCount}/${totalSubtasksCount} Subtasks done`;
    let progressBarHTML = /*html*/ `
    <div class="TaskProgressbar" role="progressbar" aria-label="Example with label" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" id="${progressBarId}" style="width: 220px;"></div>
        <div class="Taskcounter">${taskCounterText}</div>
    </div>
`;
    updateProgressBar(element);
    return /*html*/ `
    <div draggable="true" ondrag="startDragging(${element.id})" class="userStoryMini" onclick="openTask(${element.id})"> 
        <div>${element.story}</div>
        <h4>${element.title}</h4>
        <div class="TaskDescription">${element.description}</div>
        ${progressBarHTML}
        <div class="taskFooter">
            <img src="./assets/img/UserInitials.svg" alt="" class="TaskMembers">
            <img src="./assets/img/medium_orange_AddTask.svg" alt="" class="taskPriority">
        </div>
    </div>
`;
    } else {
        return /*html*/ `
        <div draggable="true" ondrag="startDragging(${element.id})" class="userStoryMini" onclick="openTask(${element.id})"> 
            <div>${element.category}</div>
            <h4>${element.title}</h4>
            <div class="TaskDescription">${element.description}</div>
            <div class="taskFooter">
                <img src="./assets/img/UserInitials.svg" alt="" class="TaskMembers">
                <img src="./assets/img/medium_orange_AddTask.svg" alt="" class="taskPriority">
            </div>
        </div>
    `;
    }}
    


/**
 * Renders a big task with detailed information.
 * @param {Object} todo - The task object to render.
 */
function renderBigTask(todo) {
let subtasks = '';
if (todo['subTasks'] == 0) {
    for (let i = 0; i < todo["subTasks"].length; i++) {
    let subTaskIndex = todo["subTasks"][i];
    let imgSrc = todo["subTasks"][i]["completed"] ? "./assets/img/check-box-checked.png" : "./assets/img/check-box-disabled.png";
    subtasks += /*html*/ `
              <span><img src="${imgSrc}" alt="" id="subTaskCheckBox" onclick="changeCompletedBoard(${i}, ${subTaskIndex})">${todo["subTasks"][i]["content"]}</span>
          `;
  }  
}

  document.getElementById("taskBig").classList.remove("d-none");
  const BigTaskHTML = /*html*/ `
       <div class="bigTask">
        <div>${todo["category"]}</div> 
        <div class="taskTitle">
          <h2>${todo["title"]}</h2>
          <img src="./assets/img/plus button.svg" alt="" onclick="closeTaskBig()">
        </div>
        <h3>${todo["description"]}</h3>
        <div class="dueDate">due date : ${todo["dueDate"]}</div>
        <div class="prio">Priority: ${todo['category']}</div>
        <div class="members">assigned to :
          <div class="userTask"><img src="./assets/img/edit contacts.svg" alt="user1" class="userImg"> Name user1</div>
          <div class="userTask"><img src="./assets/img/edit contacts.svg" alt="user2" class="userImg"> name user 2</div>
        </div>
        <div class="subtask"><p>Subtasks</p>${subtasks}</div>
        <footer class="taskfooter">
          <img src="./assets/img/Delete contact.svg" alt="delete" class="iconTask" onclick="deleteTaskBoard(${todo["id"]})"> 
          <img src="./assets/img/edit contacts.svg" alt="edit" class="iconTask" onclick="editTask(${todo["id"]})">
        </footer>
      </div>
    `;

  document.getElementById("taskBig").innerHTML = BigTaskHTML;
}

function changeCompletedBoard(taskIndex, subTaskIndex) {
    taskData[taskIndex].subTasks[subTaskIndex].completed = !taskData[taskIndex].subTasks[subTaskIndex].completed;
}

/**
 * Renders the add task form.
 * @returns {string} - The HTML for the add task form.
 */
function renderAddTaskForm() {
  return /*html*/ `
        <div class="dialog-content">
            <form id="addTaskForm">
                <!-- Hier die Inhalte der AddTask-Form einfügen -->
                <div id="cardHeadline" >
                    <h2>Add Task</h2>
                    <p id="closeDialogBTN" onclick="closeAddTaskDialog()">&#10005;</p>
                </div>

                <div class="main-addTask">
                    <div class="sections-addTask">
                        <!-- Title -->
                        <section class="input-parts-addTask">
                            <div class="pd-bottom"><span>Title<span class="required-addTask">*</span></span></div>
                            <input id="titleAddTask" type="text" placeholder="Enter a Title" required class="border-input-addtask"/>
                        </section>

                        <!-- Description -->
                        <section class="padding-description">
                            <div class="pd-bottom"><span>Description</span></div>
                            <textarea name="description" id="descriptionAddTask" cols="30" rows="10" placeholder="Enter a Description" class="border-input-addtask"></textarea>
                        </section>

                        <!-- Assigend To -->
                       <section class="padding-description">
                            <div class="pd-bottom"><label>Assigned to</label></div>
                                <div class="">
                                <div id="assignAddTask" name="assignTo" class="border-none input-assignedTo"><span>Select contacts to assign</span>
                                <img class="assignToDDArrow" src="assets/img/arrow_drop_down_AddTask.svg" onclick="openAssignTo()" id="arrowdown" alt="arrowdown"/>
                                <img src="assets/img/arrow_drop_down_AddTask.svg" onclick="closeAssignTo()" id="arrowup" alt="arrowup" class="assignToDDArrow rotate d-none">
                                </div>              
                            </div>
                            <div id="assignToDropdown" class="assignToDropdown assignField d-none">
                                <!-- <input title="assignToFilter" type="text" onkeyup="filterNames()" id="contactSearch" class="assignToContactField">
                                <img src="assets/img/arrow_drop_down_AddTask.svg" onclick="closeAssignTo()" id="arrowup" alt="arrowup" class="assignToDDArrow rotate"> -->
                            <div id="assignToList" class="assignToDropDownMenu"></div>
                            </div>
                            <div id="assignedUser" class="assignedUserList"></div>
                        </section>
                    </div>

                    <!-- Seperator -->
                    <div><img src="assets/img/seperator_AddTask.svg" alt="seperator" id="seperator" /></div>

                    <!-- Right Part of Add Task -->
                    <div class="sections-addTask">
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
                            <div class="input-assignedTo border-input-addtask" id="categoryContainer">
                                <select title="category" id="categoryAddTask" class="input-category" onchange="handleCategoryChange(this)" onclick="changeBorderColor()">
                                    <option value="" selected disabled>Select Task Category</option>
                                    <option value="User Story">User Story</option>
                                    <option value="Technical Story">Technical Story</option>
                                </select>
                            </div>
                        </section> 

                        <!-- Subtasks -->
                        <section class="sectionSubtasks">
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

                        <button onclick="saveTask(id)" class="footer-btn-text-img" type="button" id="create-btn">
                            Create Task
                            <img src="assets/img/create_hook_white_AddTask.svg" alt="create_hook_white_AddTask">
                        </button>
                    </div>
                </footer>
            </form>
        </div>
    `;
}

/**
 * Edits a task.
 * @param {number} id - The ID of the task to edit.
 */
function editTask(id) {
  const todo = todos.find((todo) => todo.id === id);
  renderEditTaskForm(todo);
}

/**
 * Renders the edit task form.
 * @param {Object} todo - The task object to edit.
 */
function renderEditTaskForm(todo) {
  document.getElementById("taskBig").classList.remove("d-none");
  document.getElementById("taskBig").innerHTML = /*html*/ `
     <div class="bigTask">
      <section class="input-parts-addTask">
       <div class="pd-bottom"><span>Title<span class="required-addTask">*</span></span></div>
       <input id="titleAddTask" type="text" placeholder="Enter a Title" required class="border-input-addtask" value="${todo.title}"/>
      </section>
      <!-- Description -->
      <section class="padding-description">
       <div class="pd-bottom"><span>Description</span></div>
       <textarea name="description" id="descriptionAddTask" cols="30" rows="10" placeholder="Enter a Description" class="border-input-addtask">${todo.description}</textarea>
      </section>
  <!-- Assigend To -->
      <section class="padding-description">
       <div class="pd-bottom"><label>Assigned to</label></div>
       <div class="input-assignedTo border-input-addtask">
       <input id="assignDropDown" type="text" name="assignTo" placeholder="Select contact to assign" class="border-none input-assignedTo"/>
         <div class="drop-down-image-assign">
          <img src="assets/img/arrow_drop_down_AddTask.svg" alt="arrowdown"/> 
         </div>              
        </div>       
        </section>
    <!-- Due Date -->
      <section>
         <div class="pd-bottom"><span>Due Date<span class="required-addTask">*</span></span></div>
         <input id="dueDate" type="date" placeholder="yyyy/mm/dd" class="input-dueDate border-input-addtask" required/>
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
      <div class="input-assignedTo border-input-addtask" id="categoryAddTask" onclick="toggleCategoryDropdown()">
          Select Task Category
          <div id="categoryDropDownArrow" class="drop-down-image">
              <img src="assets/img/arrow_drop_down_AddTask.svg" alt="arrow_drop_down_AddTask">
          </div>
      </div>
      <div class="d-none category-menu">
          <div class="category-option" onclick="selectCategory('User Story')">User Story</div>
          <div class="category-option" onclick="selectCategory('Technical Story')">Technical Story</div>
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
             <div id="showsubtasks" class="subtasks-list d-none"></div>
            </section>
   <img src="./assets/img/button_OK.svg" alt="delete" class="iconTask" onclick="saveTask(${todo["id"]})">
  </div>
    `;
}
