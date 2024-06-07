/**
 * Includes HTML content from external files into elements with the 'w3-include-html' attribute.
 * @returns {Promise<void>}
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  initSidemenu();
}

/**
 * Initializes the sidemenu by highlighting the previously clicked button.
 */
function initSidemenu() {
  let clickedBtnId = localStorage.getItem("clickedBtnId");
  if (clickedBtnId) {
    let clickedBtn = document.getElementById(clickedBtnId);
    clickedBtn.classList.add("clickedSideBtn");
  }
}

/**
 * Hides specific elements if the user navigated from the login page.
 * @returns {Promise<void>}
 */
async function hideElements() {
  await new Promise(resolve => setTimeout(resolve, 25));
  if (!document.referrer.includes("login.html") && !document.referrer.includes("sign_up.html")) {
    return; 
  }

  const elementIDs = ["sideBtn1", "sideBtn2", "sideBtn3", "sideBtn4", "navBar", "navBar1", "navBar2", "navBar3", "navBar4", "legal", "privacy", "help", "userHeader"];

  elementIDs.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("d-none");
    }
  });
}