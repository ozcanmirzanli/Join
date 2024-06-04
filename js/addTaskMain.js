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
 * Handles input focus event.
 */
function handleInputFocus() {
    let subtasksInput = document.querySelector("addSubtaskMain");
    subtasksInput.style.borderColor = "rgba(41, 171, 226, 1)";
  }

  /**
 * Handles focus event on subtask input.
 */
function handleFocus() {
    let addSubtaskMain = document.querySelector(".addSubtaskMain");
    addSubtaskMain.style.border = "1px solid rgba(41, 171, 226, 1)";
  }
  
  /**
   * Handles blur event on subtask input.
   */
  function handleBlur() {
    let addSubtaskMain = document.querySelector(".addSubtaskMain");
    addSubtaskMain.style.border = "1px solid rgba(209, 209, 209, 1)";
  }