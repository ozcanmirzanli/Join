/**
 * Setze alle Buttons zurück auf die Standardfarben und Schriftfarben
 *
 * @param {*} priority
 */
function changePriorityColor(priority) {
    document.getElementById("btnPrioUrgent").style.backgroundColor = "#ffffff";
    document.getElementById("btnPrioUrgent").style.color = "#000000";
    document.getElementById("btnPrioUrgent").style.borderColor = "#D1D1D1";
    document.getElementById("btnPrioUrgent").getElementsByTagName("img")[0].src = "assets/img/urgent_red_AddTask.svg";

    document.getElementById("btnPrioMedium").style.backgroundColor = "#ffffff";
    document.getElementById("btnPrioMedium").style.color = "#000000";
    document.getElementById("btnPrioMedium").style.borderColor = "#D1D1D1";
    document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src = "assets/img/medium_orange_AddTask.svg";

    document.getElementById("btnPrioLow").style.backgroundColor = "#ffffff";
    document.getElementById("btnPrioLow").style.color = "#000000";
    document.getElementById("btnPrioLow").style.borderColor = "#D1D1D1";
    document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src = "assets/img/low_green_AddTask.svg";
 /**
 * Ändere die Farben des angeklickten Buttons entsprechend der Priorität
 *
 */   
    if (priority === 'urgent') {
        document.getElementById("btnPrioUrgent").style.backgroundColor = "#FF3D00";
        document.getElementById("btnPrioUrgent").style.color = "#FFFFFF";
        document.getElementById("btnPrioUrgent").style.borderColor = "#FF3D00";
        document.getElementById("btnPrioUrgent").getElementsByTagName("img")[0].src = "assets/img/urgent_white_AddTask.svg";
    } else if (priority === 'medium') {
        document.getElementById("btnPrioMedium").style.backgroundColor = "#FFA800";
        document.getElementById("btnPrioMedium").style.color = "#FFFFFF";
        document.getElementById("btnPrioMedium").style.borderColor = "#FFA800";
        document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src = "assets/img/medium_white_AddTask.svg";
    } else if (priority === 'low') {
        document.getElementById("btnPrioLow").style.backgroundColor = "#7AE229";
        document.getElementById("btnPrioLow").style.color = "#FFFFFF";
        document.getElementById("btnPrioLow").style.borderColor = "#7AE229";
        document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src = "assets/img/low_white_AddTask.svg";
    }
}

function toggleCategoryDropdown() {
    let categoryDropdown = document.querySelector('.category-menu');
    let dropdownImage = document.querySelector('.drop-down-image img');
    
    categoryDropdown.classList.toggle('d-none');
    dropdownImage.classList.toggle('rotate180');
}

function selectCategory(category) {
    let categoryAddTask = document.getElementById('categoryAddTask');
    let categoryDropdown = document.querySelector('.category-menu');
    let dropdownImage = document.querySelector('.drop-down-image img');

    categoryAddTask.innerText = category;
    categoryDropdown.classList.add('d-none');
    dropdownImage.classList.remove('rotate180');
}

function toggleSubtasks() {
    const subtasksDiv = document.getElementById('subtasks');
    const plusIcon = document.getElementById('plusIcon');
    const cancelSubtask = document.getElementById('cancelSubtask');

    if (subtasksDiv.classList.contains('d-none')) {
        subtasksDiv.classList.remove('d-none');
        plusIcon.classList.add('d-none');
    } else {
        subtasksDiv.classList.add('d-none');
        plusIcon.classList.remove('d-none');
    }
}

function cancelSubtaskClick() {
    const subtasksDiv = document.getElementById('subtasks');
    const plusIcon = document.getElementById('plusIcon');
    const cancelSubtask = document.getElementById('cancelSubtask');

    subtasksDiv.classList.add('d-none');
    plusIcon.classList.remove('d-none');
    
}

document.getElementById('cancelSubtask').addEventListener('click', cancelSubtaskClick);

function handleInputFocus() {
    const inputField = document.getElementById('addsubtask');
    inputField.style.borderColor = 'rgba(41, 171, 226, 1)';
    inputField.style.outline = 'none';
}

function saveSubtask() {
    const inputField = document.getElementById('addsubtask');
    const inputValue = inputField.value.trim();
    
    if (inputValue !== '') {
        const showSubtasks = document.getElementById('showsubtasks');
        
        // Erstelle ein neues Element für die gespeicherte Subtask
        const newSubtask = document.createElement('div');
        newSubtask.classList.add('subtask-item');
        newSubtask.innerText = '\u2022 ' + inputValue; // Füge Aufzählung hinzu

        // Füge das neue Element zur Liste hinzu
        showSubtasks.appendChild(newSubtask);
        
        // Leere das Input-Feld
        inputField.value = '';
        
        // Zeige die showsubtasks DIV an, falls sie versteckt ist
        showsubtasks.classList.remove('d-none');
    }
}








