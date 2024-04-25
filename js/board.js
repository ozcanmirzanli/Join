let todos = [
  {
    id: 0,
    title: "Putzen",
    description: "blah",
    date: "24.05.2024",
    story: "userStory",
    category: "toDo",
  },
  {
    id: 1,
    title: "nooooo",
    description: "blah",
    date: "24.05.2024",
    story: "userStory",
    category: "inProgress",
  },
];

let currentDraggedElement;

function updateHTMLBoard() {
  let toDo = todos.filter((t) => t["category"] == "toDo");//Filter array nach category toDo 

  document.getElementById("toDo").innerHTML = "";//leert element mit id toDo
  if (toDo.length === 0) {
    document.getElementById("toDo").innerHTML = "<div>No Tasks to do.</div>";//erstellt div 'No Tasks to do.'
  } else {
  for (let index = 0; index < toDo.length; index++) {
    const element = toDo[index];
    document.getElementById("toDo").innerHTML += generateTodoHTML(element);//erstellt alle Tasks mit category: toDo
  }}

  let inProgress = todos.filter((t) => t["category"] == "inProgress"); //Filter Array nach category: inProgress

  document.getElementById("inProgress").innerHTML = "";//leert element mit id inProgress
  if (inProgress.length === 0) {
    document.getElementById("inProgress").innerHTML = "<div>No Tasks in Progress.</div>";//erstellt div 'No Tasks in Progress.'
  } else {

  for (let index = 0; index < inProgress.length; index++) {
    const element = inProgress[index];
    document.getElementById("inProgress").innerHTML +=//erstellt alle Tasks mit category: inProgress
      generateTodoHTML(element);
  }}

  let awaitFeedback = todos.filter((t) => t["category"] == "awaitFeedback");//Filter Array nach category: awaitFeedback

  document.getElementById("awaitFeedback").innerHTML = "";//leert element mit id awaitFeedback
  if (awaitFeedback.length === 0) {
    document.getElementById("awaitFeedback").innerHTML = "<div>No Tasks await Feedback.</div>";//erstellt div 'No Tasks await Feedback.'
  } else {
  for (let index = 0; index < awaitFeedback.length; index++) {
    const element = awaitFeedback[index];
    document.getElementById("awaitFeedback").innerHTML +=//erstellt alle Tasks mit category: awaitFeedback
      generateTodoHTML(element);
  }}

  let done = todos.filter((t) => t["category"] == "done");//Filter Array nach category: done

  document.getElementById("done").innerHTML = "";//leert element mit id done
  if (done.length === 0) {
    document.getElementById("done").innerHTML = "<div>No Tasks done.</div>";//erstellt div 'No Tasks done.'
  } else {
  for (let index = 0; index < done.length; index++) {
    const element = done[index];
    document.getElementById("done").innerHTML += generateTodoHTML(element);//erstellt alle Tasks mit category: done
  }
}}

function generateTodoHTML(element) {//erstellt element entsprechend category
  return /*html*/ `
      <div draggable="true" ondragstart="startDragging(${element["id"]})"> 
      <div>${element["story"]}</div>
      <h4>${element["title"]}</h4>
      <div>${element["description"]}</div>
      <div>${element["date"]}</div>
      </div>
  `;
}

function startDragging(id) {
  currentDraggedElement = id;//saves id from dragged element
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement]["category"] = category;//change category of element
  updateHTMLBoard();//update Board 
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");//add class on element by dragover
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");// remove class on element by dragleave
}

function filterTasks() {
  let search = document.getElementById("search").value.toLowerCase();//eingabe des inputfield speichern
  
  let filteredTodos = todos.filter(todo =>//erstellt neues array filterdTodos
    (todo.title.toLowerCase().includes(search) || todo.description.toLowerCase().includes(search)) &&// filtert FilterdTodos nach 'title' and 'description'
    (todo.category === "toDo" || todo.category === "inProgress" || todo.category === "awaitFeedback" || todo.category === "done")//filtert filredTodos nach 'category'
  );

  displayFilteredTodos(filteredTodos);//ruft displayFilteredTodos() auf
}

function displayFilteredTodos(filteredTodos) {
  document.getElementById("toDo").innerHTML = "";//leert element mit id 'toDo'
  document.getElementById("inProgress").innerHTML = "";//leert element mit id 'inProgress'
  document.getElementById("awaitFeedback").innerHTML = "";//leert element mit id 'awaitFeedback'
  document.getElementById("done").innerHTML = "";//leert element mit id 'done'

  filteredTodos.forEach(todo => {//erstellt für filteredtodos nach category neues HTML
    if (todo.category === "toDo") {
      document.getElementById("toDo").innerHTML += generateTodoHTML(todo);//erstellt in element 'toDo' für category 'toDo' neues Html
    } else if (todo.category === "inProgress") {
      document.getElementById("inProgress").innerHTML += generateTodoHTML(todo);//erstellt in element 'inProgress' für category 'inPrgress' neues Html
    } else if (todo.category === "awaitFeedback") {
      document.getElementById("awaitFeedback").innerHTML += generateTodoHTML(todo);//erstellt in element 'awaitFeedback' für category 'awaitFeedback' neues Html
    } else if (todo.category === "done") {
      document.getElementById("done").innerHTML += generateTodoHTML(todo);//erstellt in element 'done' für category 'done' neues Html
    }
  });
}  

function showaddTaskBoard(){
  let addTask = document.getElementById('addTask');//get element with id 'addTask'
  addTask.classList.remove('d-none');//remove class d-none
  addTask.classList.add('addTask');//add class 'addTask'
  creatTask();
}

function addTaskBoard(){
  //addtask.html einbinden??
}