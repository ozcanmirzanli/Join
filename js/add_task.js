let subtask = [];
let taskData = [];
let taskIdCounter = 0;
let selectedPrio = '';
let newTask = [];

async function init () {
    includeHTML();
    await loadTasksData();
}

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
        selectedPrio = 'urgent';
    } else if (priority === 'medium') {
        document.getElementById("btnPrioMedium").style.backgroundColor = "#FFA800";
        document.getElementById("btnPrioMedium").style.color = "#FFFFFF";
        document.getElementById("btnPrioMedium").style.borderColor = "#FFA800";
        document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src = "assets/img/medium_white_AddTask.svg";
        selectedPrio = 'medium';
    } else if (priority === 'low') {
        document.getElementById("btnPrioLow").style.backgroundColor = "#7AE229";
        document.getElementById("btnPrioLow").style.color = "#FFFFFF";
        document.getElementById("btnPrioLow").style.borderColor = "#7AE229";
        document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src = "assets/img/low_white_AddTask.svg";
        selectedPrio = 'low';
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
    const subtaskInput = document.getElementById('addsubtask');
    const subtaskText = subtaskInput.value;
    
    if (subtaskText !== '') {
        // Erstellen des HTML-Codes für den Subtask
        const subtaskHTML = renderSubtaskItem(subtaskText);

        // Hinzufügen des Subtask-HTML-Codes zum Element mit der ID 'showsubtasks'
        const showSubtasksContainer = document.getElementById('showsubtasks');
        showSubtasksContainer.insertAdjacentHTML('beforeend', subtaskHTML);

        // Clear subtask input
        subtaskInput.value = '';

        // Hier entfernst du die Klasse d-none, um die Subtasks anzuzeigen
        showSubtasksContainer.classList.remove('d-none');
    }
}

function renderSubtaskItem(subtask, i) {
    return `
        <div class="subtask-item">
            <div id="subtask${i}" class="subtask-content">
                <span>\u2022 ${subtask}</span>
            </div>
            <div id="subtaskEditInput${i}" class="subtask-content d-none">
                <input value="${subtask}" class="subtask-input subtaskEditText" id="subtaskInput${i}">
                <div class="subtask-bounding-box">
                    <img onclick="subtaskDelete(${i})" src="assets/img/subtask_trash_AddTask.svg" alt="Delete Subtask" class="subtask-icon">
                    <img src="assets/img/subtask_seperator_AddTask.svg" alt="Separator" class="subtask-icon">
                    <img onclick="subtaskSaveEdit(${i})" src="assets/img/subtask_check_AddTask.svg" alt="Check Subtask" class="subtask-icon">
                </div>
            </div>
            <div id="mainBoundingBox" class="subtask-bounding-box">
                <img onclick="subtaskEdit(${i})" src="assets/img/subtask_edit_AddTask.svg" alt="Edit Subtask" class="subtask-icon">
                <img src="assets/img/subtask_seperator_AddTask.svg" alt="Separator" class="subtask-icon">
                <img onclick="subtaskDelete(${i})" src="assets/img/subtask_trash_AddTask.svg" alt="Delete Subtask" class="subtask-icon">
            </div>
        </div>
    `;
}

function subtaskEdit(i) {
    let subtaskContent = document.getElementById(`subtask${i}`);
    let subtaskEditInput = document.getElementById(`subtaskEditInput${i}`);
    document.getElementById(`mainBoundingBox`).classList.add('d-none');

    subtaskContent.classList.toggle('d-none');
    subtaskEditInput.classList.toggle('d-none');
}

function subtaskSaveEdit(i) {
    let subtaskContent = document.getElementById(`subtask${i}`);
    let subtaskEditInput = document.getElementById(`subtaskEditInput${i}`);
    let subtaskInput = document.getElementById(`subtaskInput${i}`);
    document.getElementById('mainBoundingBox').classList.remove('d-none');


    subtaskContent.querySelector('span').textContent = `\u2022 ${subtaskInput.value}`;
    subtaskContent.classList.toggle('d-none');
    subtaskEditInput.classList.toggle('d-none');
}

function subtaskDelete(i) {
    let subtaskContainer = document.getElementById(`subtask${i}`).parentNode;
    subtaskContainer.remove();

    // Nach dem Entfernen eines Subtasks werden die verbleibenden Subtasks neu nummeriert
    let subtaskItems = document.querySelectorAll('.subtask-item');
    subtaskItems.forEach((item, index) => {
        item.querySelector('.subtask-content').id = `subtask${index}`;
        item.querySelector('.subtask-content input').id = `subtaskInput${index}`;
        item.querySelector('.subtask-bounding-box img').setAttribute('onclick', `subtaskEdit(${index})`);
        item.querySelector('.subtask-bounding-box img:last-child').setAttribute('onclick', `subtaskDelete(${index})`);
    });
}

function clearEntries() {
    // Clear-Eingaben für die Titel-Section
    document.getElementById('titleAddTask').value = '';
    // Clear-Eingaben für die Description-Section
    document.querySelector('.padding-description textarea').value = '';
    // Clear-Eingaben für die Assigned To-Section
    document.getElementById('assignAddTask').value = '';
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
    subtaskDelete();
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
    categoryArrowDiv.innerHTML = '<img src="assets/img/arrow_drop_down_AddTask.svg" alt="arrow_drop_down_AddTask">';
    // Setze die Border Color zurück
    categoryDropdown.style.borderColor = "#D1D1D1";
    // Füge das onclick-Event wieder hinzu
    categoryDropdown.onclick = toggleCategoryDropdown;
}


async function createTask() {
    // Erforderliche Felder prüfen
    let title = document.getElementById('titleAddTask').value;
    let dueDate = document.getElementById('dueDate').value;

    if (title === '' || dueDate === '') {
        alert('Please fill in all required fields.');
        return;
    }

    // Werte aus den Abschnitten abrufen
    let subTasks = document.getElementById('addsubtask').value;

    taskData.push ({
        id: taskIdCounter++,
        title: title,
        description: document.getElementById('descriptionAddTask').value,
        assignTo: document.getElementById('assignAddTask').value,
        dueDate: dueDate,
        category: document.getElementById('categoryAddTask').textContent,
        subTasks: subTasks.split('\n').map(subTask => ({ id: taskIdCounter++, content: subTask.trim() })),
        priority: selectedPrio,
    });
        // await setItem('taskData', JSON.stringify(taskData));

    taskData.push(newTask);

    clearEntries()

    // JSON-Array ausgeben (nur für Debugging-Zwecke)
    console.log(taskData);
};

async function loadTasksData() {
    try {
        taskData = JSON.parse(await getItem('taskData'))
    }
    catch (e) {
        console.info('Could not load tasks')
    }
}