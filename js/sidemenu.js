/*Java Script für header.html & sidemenu.html*/
function changeInitials() {
    let image = document.getElementById('initials'); 
    image.src = "/assets/img/UserInitialsHover.svg";//change img src from element with Id 'initials'

    let submenu = document.getElementById('subMenu');
    submenu.classList.remove('d-none');//show submenu
    submenu.classList.add('subMenu');//style submenu
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
    document.getElementById().classList.remove('clickedSideBtn');
    let clickedBtn = document.getElementById(id);
    localStorage.setItem('clickedBtnId', id);//save id of clicked Button
    clickedBtn.classList.add('clickedSideBtn');//higliht clicked Button
}
