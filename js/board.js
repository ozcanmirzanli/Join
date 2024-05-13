/**
 * Represents an array of todo objects.
 * @type {Array}
 */

let taskData =[];
//let taskIdCounter = 0;
let subTaskIdCounter = 0;

/**
 * Represents the ID of the currently dragged element.
 * @type {number}
 */
let currentDraggedElement = [];

async function initBoard(){
  await loadTasksDataBoard();
  updateHTMLBoard();
}

async function loadTasksDataBoard(){
  try {
    taskData = JSON.parse(await getItem('taskData'))
}
catch (e) {
    console.info('Could not load tasks')
}}

/**
 * Updates the HTML board based on the current state of todos.
 */
function updateHTMLBoard() {
  let toDo = taskData.filter((t) => t["todo"] == "toDo"); //Filter array nach category toDo

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

  let inProgress = taskData.filter((t) => t["todo"] == "inProgress"); //Filter Array nach category: inProgress

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

  let awaitFeedback = taskData.filter((t) => t["todo"] == "awaitFeedback"); //Filter Array nach category: awaitFeedback

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

  let done = taskData.filter((t) => t["todo"] == "done"); //Filter Array nach category: done

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
  taskData[currentDraggedElement]["todo"] = category; //change category of element
  await saveDraggedTask(taskData[currentDraggedElement]);
  updateHTMLBoard(); //update Board
}

async function saveDraggedTask(updatedTask){

  taskData.push ({
    id: updatedTask["id"],
    title: updatedTask["title"],
    description: updatedTask["description"],
    assignTo: updatedTask["assignTo"],
    dueDate: updatedTask["dueDate"],
    category: updatedTask["category"],
     subTasks: updatedTask["subTasks"],
    todo: updatedTask["todo"],
  });
    
  await setItem('taskData', JSON.stringify(taskData));
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
  let search = document.getElementById("search").value.toLowerCase(); //eingabe des inputfield speichern

  let filteredTodos = taskData.filter(
    (
      todo //erstellt neues array filterdTodos
    ) =>
      (taskData["title"].toLowerCase().includes(search) ||
      taskData.description.toLowerCase().includes(search)) && // filtert FilterdTodos nach 'title' and 'description'
      ( taskData["todo"] === "toDo" ||
      taskData["todo"] === "inProgress" ||
      taskData["todo"] === "awaitFeedback" ||
      taskData["todo"] === "done") //filtert filredTodos nach 'category'
  );

  displayFilteredTodos(filteredTodos); //ruft displayFilteredTodos() auf
}

/**
 * Displays filtered tasks on the HTML board.
 * @param {Array} filteredTodos - The filtered tasks to display.
 */
function displayFilteredTodos(filteredTodos) {
  document.getElementById("toDo").innerHTML = ""; //leert element mit id 'toDo'
  document.getElementById("inProgress").innerHTML = ""; //leert element mit id 'inProgress'
  document.getElementById("awaitFeedback").innerHTML = ""; //leert element mit id 'awaitFeedback'
  document.getElementById("done").innerHTML = ""; //leert element mit id 'done'

  filteredTodos.forEach((todo) => {
    //erstellt für filteredtodos nach category neues HTML
    if (taskData["todo"] === "toDo") {
      document.getElementById("toDo").innerHTML += generateTodoHTML(todo); //erstellt in element 'toDo' für category 'toDo' neues Html
    } else if (taskData["todo"] === "inProgress") {
      document.getElementById("inProgress").innerHTML += generateTodoHTML(todo); //erstellt in element 'inProgress' für category 'inPrgress' neues Html
    } else if (taskData["todo"] === "awaitFeedback") {
      document.getElementById("awaitFeedback").innerHTML +=
        generateTodoHTML(todo); //erstellt in element 'awaitFeedback' für category 'awaitFeedback' neues Html
    } else if (taskData["todo"] === "done") {
      document.getElementById("done").innerHTML += generateTodoHTML(todo); //erstellt in element 'done' für category 'done' neues Html
    }
  });
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
  // Erstellen Sie das Dialogfenster und fügen Sie die AddTask-Form hinzu
  const dialogContent = document.createElement("div");
  dialogContent.innerHTML = renderAddTaskForm();

  // Fügen Sie das Dialogfenster zum Body hinzu
  document.body.appendChild(dialogContent);
}

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
function deleteTask(id) {
  const index = taskData.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    taskData.splice(index, 1);
  }
  updateHTMLBoard();
  closeAddTaskDialog();
}

async function saveTask(id) {
  
  let subTasks = document.getElementById('addsubtask').value;

  let subTasksArray = subTasks.split('\n').map(subTask => ({
    id: subTaskIdCounter++,
    content: subTask.trim(),
    completed: false
  }));

  taskData.push ({
      id: taskIdCounter++,
      title: document.getElementById('titleAddTask').value,
      description: document.getElementById('descriptionAddTask').value,
      assignTo: document.getElementById('assignAddTask').value,
      dueDate: document.getElementById('dueDate').value,
      category: document.getElementById('categoryAddTask').value,
      subTasks: subTasksArray,
      priority: selectedPrio,
      todo: "toDo",
  });
    
  await setItem('taskData', JSON.stringify(taskData));

  closeAddTaskDialog();
};


/**
 * Setze alle Buttons zurück auf die Standardfarben und Schriftfarben
 *
 * @param {*} priority
 */
function changePriorityColor(priority) {
  document.getElementById("btnPrioUrgent").style.backgroundColor = "#ffffff";
  document.getElementById("btnPrioUrgent").style.color = "#000000";
  document.getElementById("btnPrioUrgent").style.borderColor = "#D1D1D1";
  document.getElementById("btnPrioUrgent").getElementsByTagName("img")[0].src = "assets/img/urgent_red_AddTask.svg";

  document.getElementById("btnPrioMedium").style.backgroundColor = "#ffffff";
  document.getElementById("btnPrioMedium").style.color = "#000000";
  document.getElementById("btnPrioMedium").style.borderColor = "#D1D1D1";
  document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src = "assets/img/medium_orange_AddTask.svg";

  document.getElementById("btnPrioLow").style.backgroundColor = "#ffffff";
  document.getElementById("btnPrioLow").style.color = "#000000";
  document.getElementById("btnPrioLow").style.borderColor = "#D1D1D1";
  document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src = "assets/img/low_green_AddTask.svg";
/**
* Ändere die Farben des angeklickten Buttons entsprechend der Priorität
*
*/   
  if (priority === 'urgent') {
      document.getElementById("btnPrioUrgent").style.backgroundColor = "#FF3D00";
      document.getElementById("btnPrioUrgent").style.color = "#FFFFFF";
      document.getElementById("btnPrioUrgent").style.borderColor = "#FF3D00";
      document.getElementById("btnPrioUrgent").getElementsByTagName("img")[0].src = "assets/img/urgent_white_AddTask.svg";
      selectedPrio = 'urgent';
  } else if (priority === 'medium') {
      document.getElementById("btnPrioMedium").style.backgroundColor = "#FFA800";
      document.getElementById("btnPrioMedium").style.color = "#FFFFFF";
      document.getElementById("btnPrioMedium").style.borderColor = "#FFA800";
      document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src = "assets/img/medium_white_AddTask.svg";
      selectedPrio = 'medium';
  } else if (priority === 'low') {
      document.getElementById("btnPrioLow").style.backgroundColor = "#7AE229";
      document.getElementById("btnPrioLow").style.color = "#FFFFFF";
      document.getElementById("btnPrioLow").style.borderColor = "#7AE229";
      document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src = "assets/img/low_white_AddTask.svg";
      selectedPrio = 'low';
  }}

  
function checkDueDate() {
  let selectedDate = new Date(document.getElementById('dueDate').value);
  let currentDate = new Date();

  if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
      alert('Please select a date that is today or later for the due date.');
      document.getElementById('dueDate').value = ''; // Zurücksetzen des Eingabefelds
  }
}

function handleCategoryChange(selectElement) {
  var selectedCategory = selectElement.value;
  // Hier können Sie die gewählte Kategorie weiterverarbeiten, z. B. sie in einer Variable speichern oder eine Funktion aufrufen
  console.log("Selected category: " + selectedCategory);
}

function changeBorderColor() {
  let categoryContainer = document.getElementById('categoryContainer');
  categoryContainer.style.borderColor = "rgba(41, 171, 226, 1)";
}
 
function updateProgressBar(todo) {
  let completedSubtasks = todo.subTasks.filter(subtask => subtask.done).length;
  let progressBarId = `progress-bar-${todo.id}`;
  let progressBar = document.getElementById(`progress-bar-${todo.id}`);
  let progress = (completedSubtasks / todo.subTasks.length) * 100;

  if (progressBar) {
      let innerProgressBar = progressBar.querySelector('.progress-bar');
      if (innerProgressBar) {
          innerProgressBar.style.width = `${progress}%`;
          innerProgressBar.style.backgroundColor = 'blue';
      }
  }
}