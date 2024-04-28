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
    let borderCategoryDropdown = document.getElementById("categoryAddTask");
    borderCategoryDropdown.style.borderColor = "rgba(41, 171, 226, 1)";
    
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

function handleInputFocus() {
    let subtasksInput = document.querySelector("addSubtaskMain");
    subtasksInput.style.borderColor = "rgba(41, 171, 226, 1)";
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

        // Erstelle eine Bounding Box für die Bearbeiten-, Trennlinien- und Löschen-Optionen
        const boundingBox = document.createElement('div');
        boundingBox.classList.add('bounding-box');

        // Erstelle die Bilder für die Bearbeiten-, Trennlinien- und Löschen-Optionen
        const editIcon = document.createElement('img');
        editIcon.src = "assets/img/subtask_edit_AddTask.svg";
        editIcon.alt = "Edit Subtask";
        editIcon.classList.add('subtask-icon');

        const separatorIcon = document.createElement('img');
        separatorIcon.src = "assets/img/subtask_seperator_AddTask.svg";
        separatorIcon.alt = "Separator";
        separatorIcon.classList.add('subtask-icon');

        const trashIcon = document.createElement('img');
        trashIcon.src = "assets/img/subtask_trash_AddTask.svg";
        trashIcon.alt = "Delete Subtask";
        trashIcon.classList.add('subtask-icon');

        // Füge die Bilder zur Bounding Box hinzu
        boundingBox.appendChild(editIcon);
        boundingBox.appendChild(separatorIcon);
        boundingBox.appendChild(trashIcon);

        // Füge die Bounding Box und die Subtask-DIV zur Liste hinzu
        newSubtask.appendChild(boundingBox);
        showSubtasks.appendChild(newSubtask);
        
        // Leere das Input-Feld
        inputField.value = '';
        
        // Zeige die showsubtasks DIV an, falls sie versteckt ist
        showsubtasks.classList.remove('d-none');
    }
}

// Annahme: inputField, checkIcon, trashIcon und separatorIcon sind definiert

editIcon.onclick = function() {
    // Bearbeitungsmodus aktivieren
    inputField.contentEditable = true;
    inputField.focus();

    // Funktion für das Speichern des geänderten Eintrags
    checkIcon.onclick = function() {
        // Speichern des geänderten Eintrags
        saveEditedSubtask();
        // Bearbeitungsmodus beenden
        inputField.contentEditable = false;
        // Hier kannst du weitere Aktionen ausführen, wenn der Eintrag gespeichert wurde
    };

    // Funktion für das Löschen des Eintrags
    trashIcon.onclick = function() {
        // Löschen des Eintrags
        deleteSubtask(subtaskId);
        // Hier kannst du weitere Aktionen ausführen, wenn der Eintrag gelöscht wurde
    };

    // Bilder auf der rechten Seite anzeigen
    showIcons();
};

function showIcons() {
    // Zeige die Bilder auf der rechten Seite an
    trashIcon.style.display = 'inline-block'; // Das Löschen-Bild anzeigen
    separatorIcon.style.display = 'inline-block'; // Das Trennlinien-Bild anzeigen
    checkIcon.style.display = 'inline-block'; // Das Speichern-Bild anzeigen
}

function saveEditedSubtask() {
    // Hier die Logik zum Speichern des geänderten Unterauftrags implementieren
}

function deleteSubtask(subtaskId) {
    // Hier die Logik zum Löschen des Unterauftrags implementieren
}

function clearEntries() {
    // Clear-Eingaben für die Titel-Section
    document.getElementById('titleAddTask').value = '';

    // Clear-Eingaben für die Description-Section
    document.querySelector('.padding-description textarea').value = '';

    // Clear-Eingaben für die Assigned To-Section
    document.getElementById('assignDropDown').value = '';

    // Clear-Eingaben für die Due Date-Section
    document.getElementById('dueDate').value = '';

    // Clear-Eingaben für die Priority-Section
    resetPriorityButtons();

    // Clear-Eingaben für die Category-Section
    resetCategorySection();

    // Clear-Eingaben für die Subtasks-Section
    document.getElementById('addsubtask').value = '';

    // Clear-Einträge in der Show Subtasks-Section
    clearShowSubtasks();
}

function clearShowSubtasks() {
    const showSubtasks = document.getElementById('showsubtasks');
    // Lösche alle untergeordneten Elemente der showSubtasks-DIV
    while (showSubtasks.firstChild) {
        showSubtasks.removeChild(showSubtasks.firstChild);
    }
}

// Eventlistener für den Clear-Button
document.getElementById('clear-btn').addEventListener('click', clearEntries);

function resetPriorityButtons() {
    // Array mit den IDs der Priority-Buttons und ihren Standardbildern
    const priorityButtons = [
        { id: 'btnPrioUrgent', imgSrc: 'assets/img/urgent_red_AddTask.svg' },
        { id: 'btnPrioMedium', imgSrc: 'assets/img/medium_orange_AddTask.svg' },
        { id: 'btnPrioLow', imgSrc: 'assets/img/low_green_AddTask.svg' }
    ];

    // Schleife über alle Button-IDs
    priorityButtons.forEach(button => {
        const buttonElement = document.getElementById(button.id);
        // Zurücksetzen der Hintergrundfarbe
        buttonElement.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        // Zurücksetzen der Border Color
        buttonElement.style.borderColor = "#D1D1D1";
        // Zurücksetzen der Schriftfarbe
        buttonElement.style.color = 'rgba(0, 0, 0, 1)';
        // Zurücksetzen des Bildes
        const imgElement = buttonElement.querySelector('img');
        imgElement.src = button.imgSrc;
    });
}

function resetCategorySection() {
    const categoryDropdown = document.getElementById('categoryAddTask');
    const categoryArrowDiv = document.getElementById('categoryDropDownArrow');
    // Setze den Text zurück
    categoryDropdown.textContent = 'Select Task Category';
    // Zurücksetzen des Drop-Down-Pfeils
    categoryArrowDiv.innerHTML = `<img src="assets/img/arrow_drop_down_AddTask.svg" alt="arrow_drop_down_AddTask">`;
    // Setze die Border Color zurück
    categoryDropdown.style.borderColor = "#D1D1D1";
    // Füge das onclick-Event wieder hinzu
    categoryDropdown.onclick = toggleCategoryDropdown;
}







