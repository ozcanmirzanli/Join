/*Java Script für header.html, sidemenu.html, PrivacyPolice.html, LegalNotice.html, help.html und sidemenu.css*/
function changeInitials() {
    let image = document.getElementById('initials'); 
    image.src = "/assets/img/UserInitialsHover.svg";

    let submenu = document.getElementById('subMenu');
    submenu.classList.remove('d-none');
    submenu.classList.add('subMenu');
}

/*ausgelagert in script.js
function initSidemenu() {
    let clickedBtnId = localStorage.getItem('clickedBtnId');
    if (clickedBtnId) {
        let clickedBtn = document.getElementById(clickedBtnId);
        clickedBtn.classList.add('clickedSideBtn');
    }
}*/

function changeBackground(id){
    let clickedBtn = document.getElementById(id);
    clickedBtn.classList.add('clickedSideBtn');
    localStorage.setItem('clickedBtnId', id);
}