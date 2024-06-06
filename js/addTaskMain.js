/**
 * Sets up event listeners for focus and blur events on the input element.
 */
document.addEventListener("DOMContentLoaded", function () {
    let addSubtaskInput = document.getElementById("addsubtask");
  
    if (addSubtaskInput) {
      // Setting up the event listeners for focus and blur events
      addSubtaskInput.addEventListener("focus", handleFocus);
      addSubtaskInput.addEventListener("blur", handleBlur);
      // Set medium priority as default
      changePriorityColor("medium");
    }
  });

/**
 * Handles category change.
 *
 * @param {HTMLSelectElement} selectElement - The select element.
 */
function handleCategoryChange(selectElement) {
    var selectedCategory = selectElement.value;
    // Here you can further process the selected category, e.g., store it in a variable or call a function
    // console.log("Selected category: " + selectedCategory);
  }

/**
 * Handles focus event on subtask input.
 */
function handleFocus() {
    let addSubtaskMain = document.getElementById("addSubtaskMain");
    addSubtaskMain.style.border = "1px solid #29abe2";
  }
  
/**
 * Handles blur event on subtask input.
 */
function handleBlur() {
    let addSubtaskMain = document.getElementById("addSubtaskMain");
    addSubtaskMain.style.border = "1px solid #29abe2"
  }

/**
 * Handles clicks outside the assignAddTask div.
 */
function handleClickOutside(event) {
    let assignAddTask = document.getElementById("assignAddTask");
    let assignToDropdown = document.getElementById("assignToDropdown");
      if (!assignAddTask.contains(event.target) && !assignToDropdown.contains(event.target)) {
          closeAssignTo();
      }
}

/**
 * Changes the border color of a container.
 */
function changeBorderColor() {
  let categoryContainer = document.getElementById("categoryAddTask");
  categoryContainer.style.borderColor = "rgba(41, 171, 226, 1)";
}

/**
 * Creates a new task for remote storage array taskData.
 */
async function createTask() {
  // Check required fields
  let title = document.getElementById("titleAddTask").value;
  let dueDate = document.getElementById("dueDate").value;

  let subTasks = subtask;

  taskData.push({
    id: taskData.length,
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
  clearEntries();
  // Display success message
  displaySuccessMessage();

  // Redirect to the board page after 2 seconds
    setTimeout(() => {
      window.location.href = "board.html";
    }, 1000);
}

/**
 * Displays a success message in the center of the screen.
 */
function displaySuccessMessage() {
  const successMessage = document.createElement("img");
  successMessage.src = "assets/img/addedTaskToBoard.svg";
  successMessage.style.position = "fixed";
  successMessage.style.top = "50%";
  successMessage.style.left = "50%";
  successMessage.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(successMessage);
}

/**
 * Checks if the selected due date is valid.
 * Only current day or future day are allowed.
 * Set Function of, because there are issue when putting date manual 
 */
function checkDueDate() {
  let selectedDate = new Date(document.getElementById("dueDate").value);
  let currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  if (selectedDate < currentDate) {
    alert("Please select a date that is today or later for the due date.");
    document.getElementById("dueDate").value = ""; // Reset the input field
  }
}