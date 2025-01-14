/**
 * Includes HTML content from external files into elements with the 'w3-include-html' attribute.
 * @returns {Promise<void>}
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
  initSidemenu();
  initHeader();
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
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (
    !document.referrer.includes("login.html") &&
    !document.referrer.includes("sign_up.html")
  ) {
    return;
  }

  const elementIDs = [
    "help",
    "sideBtn1",
    "sideBtn2",
    "sideBtn3",
    "sideBtn4",
    "navBar",
    "navBar1",
    "navBar2",
    "navBar3",
    "navBar4",
    "legal",
    "privacy",
  ];

  elementIDs.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("d-none");
    }
  });
}
