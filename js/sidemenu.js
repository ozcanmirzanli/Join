/*Java Script für header.html & sidemenu.html*/
/**
 * Changes the initials image source and displays the submenu.
 */
function changeInitials() {
  // Change the image source of the element with ID 'initials'
  let image = document.getElementById("initials");
  image.src = "/assets/img/UserInitialsHover.svg";

  // Show the submenu by removing 'd-none' class and adding 'subMenu' class for styling
  let submenu = document.getElementById("subMenu");
  submenu.classList.remove("d-none");
  submenu.classList.add("subMenu");
}

/*ausgelagert in script.js
function initSidemenu() {
    let clickedBtnId = localStorage.getItem('clickedBtnId');
    if (clickedBtnId) {
        let clickedBtn = document.getElementById(clickedBtnId);
        clickedBtn.classList.add('clickedSideBtn');
    }
}*/

/**
 * Changes the background of the clicked button and saves its ID to local storage.
 * @param {string} id - The ID of the clicked button.
 */
function changeBackground(id) {
  // Remove 'clickedSideBtn' class from all buttons
  document.getElementById("sideBtn1").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn2").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn3").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn4").classList.remove("clickedSideBtn");
  // Get the clicked button and add 'clickedSideBtn' class to it
  let clickedBtn = document.getElementById(id);
  localStorage.setItem("clickedBtnId", id); // Save ID of clicked Button
  clickedBtn.classList.add("clickedSideBtn"); // Highlight clicked Button
}

function goBack() {
  window.history.back();
}
