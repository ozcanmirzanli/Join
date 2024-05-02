let todos = [
  {
    id: 0,
    title: "Putzen",
    description: "blah",
    date: "24.05.2024",
    story: "userStory",
    category: "done",
  },
  {
    id: 1,
    title: "nooooo",
    description: "blah",
    date: "24.05.2024",
    story: "userStory",
    category: "inProgress",
  },
  {
    id: 2,
    title: "asdf",
    description: "asdf",
    date: "29.05.2024",
    story: "userStory",
    category: "awaitingFeedback",
  },
  {
    id: 3,
    title: "bla",
    description: "bla",
    date: "29.05.2024",
    story: "userStory",
    category: "toDo",
  },
];

let currentDraggedElement=[];

function updateHTMLBoard() {
  let toDo = todos.filter((t) => t["category"] == "toDo"); //Filter array nach category toDo

  document.getElementById("toDo").innerHTML = ""; //leert element mit id toDo
  if (toDo.length === 0) {
    document.getElementById("toDo").innerHTML =
      "<div class='noToDo'>No Tasks to do.</div>"; //erstellt div 'No Tasks to do.'
  } else {
    for (let index = 0; index < toDo.length; index++) {
      const element = toDo[index];
      document.getElementById("toDo").innerHTML += generateTodoHTML(element); //erstellt alle Tasks mit category: toDo
    }
  }

  let inProgress = todos.filter((t) => t["category"] == "inProgress"); //Filter Array nach category: inProgress

  document.getElementById("inProgress").innerHTML = ""; //leert element mit id inProgress
  if (inProgress.length === 0) {
    document.getElementById("inProgress").innerHTML =
      "<div class='noToDo'>No Tasks in Progress.</div>"; //erstellt div 'No Tasks in Progress.'
  } else {
    for (let index = 0; index < inProgress.length; index++) {
      const element = inProgress[index];
      document.getElementById("inProgress").innerHTML += //erstellt alle Tasks mit category: inProgress
        generateTodoHTML(element);
    }
  }

  let awaitFeedback = todos.filter((t) => t["category"] == "awaitFeedback"); //Filter Array nach category: awaitFeedback

  document.getElementById("awaitFeedback").innerHTML = ""; //leert element mit id awaitFeedback
  if (awaitFeedback.length === 0) {
    document.getElementById("awaitFeedback").innerHTML =
      "<div class='noToDo'>No Tasks await Feedback.</div>"; //erstellt div 'No Tasks await Feedback.'
  } else {
    for (let index = 0; index < awaitFeedback.length; index++) {
      const element = awaitFeedback[index];
      document.getElementById("awaitFeedback").innerHTML += //erstellt alle Tasks mit category: awaitFeedback
        generateTodoHTML(element);
    }
  }

  let done = todos.filter((t) => t["category"] == "done"); //Filter Array nach category: done

  document.getElementById("done").innerHTML = ""; //leert element mit id done
  if (done.length === 0) {
    document.getElementById("done").innerHTML =
      "<div class='noToDo'>No Tasks done.</div>"; //erstellt div 'No Tasks done.'
  } else {
    for (let index = 0; index < done.length; index++) {
      const element = done[index];
      document.getElementById("done").innerHTML += generateTodoHTML(element); //erstellt alle Tasks mit category: done
    }
  }
}

function generateTodoHTML(element) {
  //erstellt element entsprechend category
  return /*html*/ `
    <div draggable="true" ondrag="startDragging(${element["id"]})"  class="userStoryMini" onclick="openTask(${element["id"]})"> 
      <div>${element["story"]}</div>
      <h4>${element["title"]}</h4>
      <div class="TaskDescription">${element["description"]}</div>
      <div class="TaskProgressbar" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" id="progress-bar" style="width: 25%"><div class="Taskcounter">1/2 Subtasks</div></div>
      </div>
      <div class="taskFooter"><img src="./assets/img/UserInitials.svg" alt="" class="TaskMembers"><img src="./assets/img/medium_orange_AddTask.svg" alt="" class="taskPriority"></div>
    </div>
  `;
}

function startDragging(id) {
  currentDraggedElement = id;
}


function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement]["category"] = category; //change category of element
  updateHTMLBoard(); //update Board
}

function openTask(id) {
  let task = todos.find(todo => todo.id === id);
  renderBigTask(task);
}

function renderBigTask(todo) {
  document.getElementById("taskBig").classList.remove('d-none');
  const BigTaskHTML = /*html*/ `
     <div class="bigTask">
      <div>${todo["story"]}</div> 
      <div class="taskTitle">
        <h2>${todo["title"]}</h2>
        <img src="./assets/img/plus button.svg" alt="" onclick="closeTaskBig()">
      </div>
      <h3>${todo.description}</h3>
      <div class="dueDate">due date : ${todo["date"]}</div>
      <div class="prio">Priority: Meduímum <img src="./assets/img/medium_orange_AddTask.svg" alt=""></div>
      <div class="members">assigned to :
        <div class="userTask"><img src="./assets/img/edit contacts.svg" alt="user1" class="userImg"> Name user1</div>
        <div class="userTask"><img src="./assets/img/edit contacts.svg" alt="user2" class="userImg"> name user 2</div>
      </div>
      <div class="subtask">subtasks</div>
      <footer class="taskfooter">
        <img src="./assets/img/Delete contact.svg" alt="delete" class="iconTask" onclick="deleteTask(${todo["id"]})"> 
        <img src="./assets/img/edit contacts.svg" alt="edit" class="iconTask" onclick="editTask(${todo["id"]})">
      </footer>
    </div>
  `;

document.getElementById("taskBig").innerHTML = BigTaskHTML;
}


function closeTaskBig(){
  document.getElementById("taskBig").classList.remove('bigTask');
  document.getElementById("taskBig").classList.add('d-none');
}

function filterTasks() {
  let search = document.getElementById("search").value.toLowerCase(); //eingabe des inputfield speichern

  let filteredTodos = todos.filter(
    (
      todo //erstellt neues array filterdTodos
    ) =>
      (todo.title.toLowerCase().includes(search) ||
        todo.description.toLowerCase().includes(search)) && // filtert FilterdTodos nach 'title' and 'description'
      (todo.category === "toDo" ||
        todo.category === "inProgress" ||
        todo.category === "awaitFeedback" ||
        todo.category === "done") //filtert filredTodos nach 'category'
  );

  displayFilteredTodos(filteredTodos); //ruft displayFilteredTodos() auf
}

function displayFilteredTodos(filteredTodos) {
  document.getElementById("toDo").innerHTML = ""; //leert element mit id 'toDo'
  document.getElementById("inProgress").innerHTML = ""; //leert element mit id 'inProgress'
  document.getElementById("awaitFeedback").innerHTML = ""; //leert element mit id 'awaitFeedback'
  document.getElementById("done").innerHTML = ""; //leert element mit id 'done'

  filteredTodos.forEach((todo) => {
    //erstellt für filteredtodos nach category neues HTML
    if (todo.category === "toDo") {
      document.getElementById("toDo").innerHTML += generateTodoHTML(todo); //erstellt in element 'toDo' für category 'toDo' neues Html
    } else if (todo.category === "inProgress") {
      document.getElementById("inProgress").innerHTML += generateTodoHTML(todo); //erstellt in element 'inProgress' für category 'inPrgress' neues Html
    } else if (todo.category === "awaitFeedback") {
      document.getElementById("awaitFeedback").innerHTML +=
        generateTodoHTML(todo); //erstellt in element 'awaitFeedback' für category 'awaitFeedback' neues Html
    } else if (todo.category === "done") {
      document.getElementById("done").innerHTML += generateTodoHTML(todo); //erstellt in element 'done' für category 'done' neues Html
    }
  });
}

function showaddTaskBoard() {
  let addTask = document.getElementById("addTask"); //get element with id 'addTask'
  addTask.style.display = "block";
  addTask.style.right = "620px"; //add class 'addTask'
}

function openAddTaskDialog() {
  // Erstellen Sie das Dialogfenster und fügen Sie die AddTask-Form hinzu
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog-content");
  dialogContent.innerHTML = renderAddTaskForm();

  // Fügen Sie das Dialogfenster zum Body hinzu
  document.body.appendChild(dialogContent);

  // Wenn ein Schließen-Button benötigt wird, fügen Sie ihn hier hinzu und definieren Sie die Logik, um das Dialogfenster zu schließen
}

function renderAddTaskForm() {
  return `
      <div class="dialog-content">
          <form id="addTaskForm">
              <!-- Hier die Inhalte der AddTask-Form einfügen -->
              <h1>Add Task</h1>

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
                          <textarea name="description" id="" cols="30" rows="10" placeholder="Enter a Description" class="border-input-addtask"></textarea>
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
                  </div>

                  <!-- Seperator -->
                  <div class="seperator-addtask"><img src="assets/img/seperator_AddTask.svg" alt="seperator"/></div>

                  <!-- Right Part of Add Task -->
                  <div class="sections-addTask">
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
                  </div>
              </div>

              <!-- Footer AddTask -->
              <footer class="addtask-footer">
                  <div>
                      <span class="required-addTask">*</span>
                      This field is required
                  </div>

                  <div class="footer-btn-addTask">
                      <button onclick="clearEntries()" class="footer-btn-text-img" type="button" id="clear-btn">
                          Clear
                          <img src="assets/img/subtask_cancel_AddTask.svg" alt="subtask_cancel_AddTask">
                      </button>

                      <button class="footer-btn-text-img" type="button" id="create-btn">
                          Create Task
                          <img src="assets/img/create_hook_white_AddTask.svg" alt="create_hook_white_AddTask">
                      </button>
                  </div>
              </footer>
          </form>
      </div>
  `;
}
/* noch anpassen
function updateProgressBar() {
  let percent = (currentTasks + 1) / subTasks.length;
  percent = Math.round(percent * 100);
  document.getElementById("progress-bar").innerHTML = `${percent}%`;
  document.getElementById("progress-bar").style.width = `${percent}%`;
}*/

function deleteTask(id){
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
  }
  updateHTMLBoard();
  closeTaskBig();
}

function editTask(id){
  const todo = todos.find(todo => todo.id === id);
  renderEditTaskForm(todo);
}

function renderEditTaskForm(todo) {
  document.getElementById("taskBig").classList.remove('d-none');
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
      <img src="./assets/img/button_OK.svg" alt="delete" class="iconTask" onclick="saveTask(${todo["id"]})">
    </div>
  `;
}