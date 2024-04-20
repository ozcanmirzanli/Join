/*Java Script für header.html, sidemenu.html, PrivacyPolice.html, LegalNotice.html, help.html und sidemenu.css*/

function changeInitials() {
    let image = document.getElementById('initials'); 
    image.src = "/assets/img/UserInitialsHover.svg";

    let submenu = document.getElementById('subMenu');
    submenu.classList.remove('d-none');
    submenu.classList.add('subMenu');
}

function changeBackground(i){

    let clickedBtn = document.getElementById('${i}sideBtn');
    clickedBtn.style.backgroundColor = 'black';
   
}