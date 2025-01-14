/* JavaScript for header.html & sidemenu.html */

let submenuOpen = false;

/**
 * Initializes the header by loading the users.
 */
async function initHeader() {
  await loadUsersHead();
}

/**
 * Loads the user information from local storage and renders the user in the header.
 */
async function loadUsersHead() {
  try {
    users = await getItem("/users");
  } catch (e) {
    console.error("Loading error:", e);
  }
  renderUserHeader();
}

/**
 * Toggles the submenu based on its current state.
 */
function toggleSubmenu() {
  if (!submenuOpen) {
    openSubmenu();
    submenuOpen = true;
  } else {
    closeSubmenu();
    submenuOpen = false;
  }
}

/**
 * Opens the submenu and changes the background color of the user header.
 */
function openSubmenu() {
  document.getElementById("userHeader").style.backgroundColor =
    "rgb(225,230,236)";
  let submenu = document.getElementById("subMenu");
  submenu.classList.remove("d-none");
  submenu.classList.add("subMenu");
  submenuOpen = true;

  addHelpToSubMenu();
}

/**
 * Closes the submenu and restores the original background color of the user header.
 */
function closeSubmenu() {
  document.getElementById("userHeader").style.backgroundColor =
    "rgb(255,255,255)";
  let submenu = document.getElementById("subMenu");
  submenu.classList.add("d-none");
  submenu.classList.remove("subMenu");
  submenuOpen = false;
}

/**
 * Sets the background of the default or previously clicked button after a delay.
 * If no button ID is stored in local storage, defaults to "sideBtn1".
 * This will guarantee that Summary Button is marked if user moved from login.html to summary.html
 */
function changeBackgroundSummaryDefault() {
  setTimeout(() => {
    let clickedBtnId = localStorage.getItem("clickedBtnId");

    if (!clickedBtnId) {
      clickedBtnId = "sideBtn1";
      localStorage.setItem("clickedBtnId", clickedBtnId);
    }

    changeBackground(clickedBtnId);
  }, 100);
}

/**
 * Changes the background of the clicked button and saves its ID to local storage.
 * @param {string} id - The ID of the clicked button.
 */
function changeBackground(id) {
  document.getElementById("sideBtn1").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn2").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn3").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn4").classList.remove("clickedSideBtn");

  let clickedBtn = document.getElementById(id);
  localStorage.setItem("clickedBtnId", id);
  clickedBtn.classList.add("clickedSideBtn");
}

/**
 * Navigates one page back in the browser history.
 */
function goBack() {
  window.history.back();
}

/**
 * Renders the user in the header based on the loaded user information.
 */
function renderUserHeader() {
  const currentUser = getCurrentUserHeader();
  if (currentUser) {
    const name = currentUser.userName;
    const initials = getInitials(name);
    const user = document.getElementById("userHeader");
    user.innerHTML = `<div class="initialsHeader">${initials}</div>`;
  } else {
    document.getElementById(
      "userHeader"
    ).innerHTML = `<div class="initialsHeader">G</div>`;
  }
}

/**
 * Gets the current user from session storage.
 * @returns {Object|null} - The user object or null if no user is found.
 */
function getCurrentUserHeader() {
  const userString = sessionStorage.getItem("currentUser");
  if (!userString) {
    return null;
  }
  try {
    // Parse the stored JSON string into a JS object
    return JSON.parse(userString);
  } catch (error) {
    // If parsing fails for any reason, return null (or handle the error)
    console.error("Failed to parse currentUser from sessionStorage:", error);
    return null;
  }
}

/**
 * Returns the initials of a name.
 * @param {string} name - The full name of the user.
 * @returns {string} - The initials of the name.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

function addHelpToSubMenu() {
  if (window.innerWidth < 551) {
    document.getElementById("help-link").classList.remove("d-none");
  }
}
