
/**
 * Updates the "To Do" column with tasks that have the status "toDo".
 * If there are no tasks, displays a message indicating no tasks are available.
 */
function updateTodo() {
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
  }
  
  /**
   * Updates the "In Progress" column with tasks that have the status "inProgress".
   * If there are no tasks, displays a message indicating no tasks are in progress.
   */
  function updateInProgress() {
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
  }
  
  /**
   * Updates the "Await Feedback" column with tasks that have the status "awaitFeedback".
   * If there are no tasks, displays a message indicating no tasks are awaiting feedback.
   */
  function updateAwaitFeedback() {
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
  }
  
  /**
   * Updates the "Done" column with tasks that have the status "done".
   * If there are no tasks, displays a message indicating no tasks are done.
   */
  function updateDone() {
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
 * Toggle the visibility of the drag menu for a specific task.
 * Closes other open drag menus and toggles the visibility of the clicked one.
 * 
 * @param {Event} event - The click event.
 * @param {string} taskId - The ID of the task.
 * @param {string} menuId - The ID of the drag menu to toggle.
 */
function toggleDragmenu(event, taskId, menuId) {
    event.stopPropagation();
    const dragMenu = document.getElementById(menuId);
    const allDragMenus = document.querySelectorAll('.dragMenu');
    allDragMenus.forEach(menu => {
      if (menu.id !== menuId) {
        menu.classList.add('d-none');
      }
    });
    if (dragMenu.classList.contains('d-none')) {
      dragMenu.classList.remove('d-none');
    } else {
      dragMenu.classList.add('d-none');
    }
  }

  
/**
 * Update the task data array with the updated fields for a specific task.
 *
 * @param {number} id - The ID of the task to be updated.
 * @param {Object} updatedFields - An object containing the updated fields for the task.
 */
function updateTaskData(id, updatedFields) {
    const index = taskData.findIndex(t => t.id === id);
    if (index !== -1) {
      taskData[index] = {
        ...taskData[index],
        ...updatedFields
      };
    } else {
      taskData.push({
        id: id,
        ...updatedFields,
        todo: 'toDo'
      });
    }
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