/* JavaScript für header.html & sidemenu.html */

let submenuOpen = false;
let users = [];

/**
 * Initialisiert den Header durch Laden der Benutzer.
 */
async function initHeader() {
  await loadUsersHead();
}

/**
 * Lädt die Benutzerinformationen aus dem lokalen Speicher und rendert den Benutzer im Header.
 */
async function loadUsersHead() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
  renderUserHeader();
}

/**
 * Öffnet oder schließt das Untermenü basierend auf dem aktuellen Zustand.
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
 * Öffnet das Untermenü und ändert die Hintergrundfarbe des Benutzerheaders.
 */
function openSubmenu() {
  document.getElementById("userHeader").style.backgroundColor = "rgb(225,230,236)";
  let submenu = document.getElementById("subMenu");
  submenu.classList.remove("d-none");
  submenu.classList.add("subMenu");
  submenuOpen = true;
}

/**
 * Schließt das Untermenü und stellt die ursprüngliche Hintergrundfarbe des Benutzerheaders wieder her.
 */
function closeSubmenu() {
  document.getElementById("userHeader").style.backgroundColor = "rgb(255,255,255)";
  let submenu = document.getElementById("subMenu");
  submenu.classList.add("d-none");
  submenu.classList.remove("subMenu");
  submenuOpen = false;
}

/**
 * Ändert den Hintergrund des geklickten Buttons und speichert dessen ID im lokalen Speicher.
 * @param {string} id - Die ID des geklickten Buttons.
 */
function changeBackground(id) {
  // Entfernt die 'clickedSideBtn' Klasse von allen Buttons
  document.getElementById("sideBtn1").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn2").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn3").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn4").classList.remove("clickedSideBtn");
  
  // Holt den geklickten Button und fügt die 'clickedSideBtn' Klasse hinzu
  let clickedBtn = document.getElementById(id);
  localStorage.setItem("clickedBtnId", id); // Speichert die ID des geklickten Buttons
  clickedBtn.classList.add("clickedSideBtn"); // Hebt den geklickten Button hervor
}

/**
 * Navigiert eine Seite zurück in der Browser-Historie.
 */
function goBack() {
  window.history.back();
}

/**
 * Rendert den Benutzer im Header basierend auf den geladenen Benutzerinformationen.
 */
function renderUserHeader() {
  const currentUser = getCurrentUserHeader();
  if (currentUser) {
    const name = currentUser.userName;
    const initials = getInitials(name);
    const user = document.getElementById("userHeader");
    user.innerHTML = `<div class="initialsHeader">${initials}</div>`;
  } else {
    document.getElementById("userHeader").innerHTML = `<div class="initialsHeader">G</div>`;
  }
}

/**
 * Holt den aktuellen Benutzer aus dem Session-Speicher.
 * @returns {Object|null} - Das Benutzerobjekt oder null, wenn kein Benutzer gefunden wurde.
 */
function getCurrentUserHeader() {
  const userName = JSON.parse(sessionStorage.getItem("currentUser"));
  if (userName) {
    return userName;
  }
  return null;
}

/**
 * Gibt die Initialen eines Namens zurück.
 * @param {string} name - Der vollständige Name des Benutzers.
 * @returns {string} - Die Initialen des Namens.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}