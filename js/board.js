/**
 * Represents an array of todo objects.
 * @type {Array}
 */

let todos = [];

/**
 * Represents the ID of the currently dragged element.
 * @type {number}
 */
let currentDraggedElement = [];

async function init(){
  await loadTasksData();
  updateHTMLBoard();
}
/**
 * Updates the HTML board based on the current state of todos.
 */
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
function moveTo(category) {
  todos[currentDraggedElement]["category"] = category; //change category of element
  updateHTMLBoard(); //update Board
}

/**
 * Opens a task when clicked on.
 * @param {number} id - The ID of the task to open.
 */
function openTask(id) {
  let task = todos.find((todo) => todo.id === id);
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
  dialogContent.classList.add("dialog-content");
  dialogContent.innerHTML = renderAddTaskForm();

  // Fügen Sie das Dialogfenster zum Body hinzu
  document.body.appendChild(dialogContent);

  // Wenn ein Schließen-Button benötigt wird, fügen Sie ihn hier hinzu und definieren Sie die Logik, um das Dialogfenster zu schließen
}

/**
 * Deletes a task.
 * @param {number} id - The ID of the task to delete.
 */
function deleteTask(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
  }
  updateHTMLBoard();
  closeTaskBig();
}

async function saveTask(id) {
  // Werte aus den Abschnitten abrufen
  let subTasks = document.getElementById('addsubtask').value;

  taskData.push ({
      id: taskIdCounter++,
      title: document.getElementById('titleAddTask').value,
      description: document.getElementById('descriptionAddTask').value,
      assignTo: document.getElementById('assignAddTask').value,
      dueDate: document.getElementById('dueDate').value,
      category: document.getElementById('categoryAddTask').textContent,
      subTasks: subTasks.split('\n').map(subTask => ({ id: taskIdCounter++, content: subTask.trim() })),
      priority: selectedPrio,
  });
      // await setItem('taskData', JSON.stringify(taskData));

  taskData.push(newTask);

  closeTaskBig();

  // JSON-Array ausgeben (nur für Debugging-Zwecke)
  console.log(taskData);
};


