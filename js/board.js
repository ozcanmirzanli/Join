let subTaskIdCounter = 0;
let currentDraggedElement = [];

/**
 * Initializes the task board by loading task data and updating the HTML board.
 * This function is asynchronous and waits for the task data to be loaded before updating the board.
 */
async function initBoard() {
    await loadTasksDataBoard();
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

/**
 * Updates the HTML board based on the current state of todos.
 */
function updateHTMLBoard() {
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
    (
      todo 
    ) =>
      (taskData["title"].toLowerCase().includes(search) ||
      taskData.description.toLowerCase().includes(search)) && 
      ( taskData["todo"] === "toDo" ||
      taskData["todo"] === "inProgress" ||
      taskData["todo"] === "awaitFeedback" ||
      taskData["todo"] === "done") 
  );

  displayFilteredTodos(filteredTodos); 
}

/**
 * Displays filtered tasks on the HTML board.
 * @param {Array} filteredTodos - The filtered tasks to display.
 */
function displayFilteredTodos(filteredTodos) {
  document.getElementById("toDo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = ""; 
  document.getElementById("awaitFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = ""; 

  filteredTodos.forEach((todo) => {
    if (taskData["todo"] === "toDo") {
      document.getElementById("toDo").innerHTML += generateTodoHTML(todo); 
    } else if (taskData["todo"] === "inProgress") {
      document.getElementById("inProgress").innerHTML += generateTodoHTML(todo); 
    } else if (taskData["todo"] === "awaitFeedback") {
      document.getElementById("awaitFeedback").innerHTML +=
        generateTodoHTML(todo); 
    } else if (taskData["todo"] === "done") {
      document.getElementById("done").innerHTML += generateTodoHTML(todo); 
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
async function saveTask(id) {
  
  let subTasks = document.getElementById('addsubtask').value;
  let subTasksArray = subTasks.split('\n').map(subTask => ({
      id: subTaskIdCounter++,
      content: subTask.trim(),
      completed: false
  }));

  const existingTask = taskData.find(task => task.id === id);
  let todoStatus = existingTask ? existingTask.todo : 'toDo';

  const task = {
      id: id,
      title: document.getElementById('titleAddTask').value,
      description: document.getElementById('descriptionAddTask').value,
      assignTo: document.getElementById('assignAddTask').value,
      dueDate: document.getElementById('dueDate').value,
      category: document.getElementById('categoryAddTask').value,
      subTasks: subTasksArray,
      priority: selectedPrio,
      todo: todoStatus,
  };

  const index = taskData.findIndex(t => t.id === id);
  if (index !== -1) {
      taskData[index] = task;
  } else {
      taskData.push(task);
  }

  await setItem('taskData', JSON.stringify(taskData));
  closeAddTaskDialog();
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
