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
  let toDo = todos.filter((t) => t["category"] == "toDo");

  if (toDo.length === 0) {
    document.getElementById("toDo").innerHTML = "<div>No Tasks to do.</div>";
  } else {
  document.getElementById("toDo").innerHTML = "";

  for (let index = 0; index < toDo.length; index++) {
    const element = toDo[index];
    document.getElementById("toDo").innerHTML += generateTodoHTML(element);
  }}

  let inProgress = todos.filter((t) => t["category"] == "inProgress");

  if (inProgress.length === 0) {
    document.getElementById("inProgress").innerHTML = "<div>No Tasks in Progress.</div>";
  } else {
  document.getElementById("inProgress").innerHTML = "";

  for (let index = 0; index < inProgress.length; index++) {
    const element = inProgress[index];
    document.getElementById("inProgress").innerHTML +=
      generateTodoHTML(element);
  }}

  let awaitFeedback = todos.filter((t) => t["category"] == "awaitFeedback");

  if (awaitFeedback.length === 0) {
    document.getElementById("awaitFeedback").innerHTML = "<div>No Tasks await Feedback.</div>";
  } else {
  document.getElementById("awaitFeedback").innerHTML = "";

  for (let index = 0; index < awaitFeedback.length; index++) {
    const element = awaitFeedback[index];
    document.getElementById("awaitFeedback").innerHTML +=
      generateTodoHTML(element);
  }}

  let done = todos.filter((t) => t["category"] == "done");

  if (done.length === 0) {
    document.getElementById("done").innerHTML = "<div>No Tasks done.</div>";
  } else {
  document.getElementById("done").innerHTML = "";

  for (let index = 0; index < done.length; index++) {
    const element = done[index];
    document.getElementById("done").innerHTML += generateTodoHTML(element);
  }
}}

function generateTodoHTML(element) {
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
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement]["category"] = category;
  updateHTML();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function filterTasks() {
  let search = document.getElementById("search").value.toLowerCase();
  
  let filteredTodos = todos.filter(todo =>
    (todo.title.toLowerCase().includes(search) || todo.description.toLowerCase().includes(search)) &&
    (todo.category === "toDo" || todo.category === "inProgress" || todo.category === "awaitFeedback" || todo.category === "done")
  );

  displayFilteredTodos(filteredTodos);
}

function displayFilteredTodos(filteredTodos) {
  document.getElementById("toDo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("awaitFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";

  filteredTodos.forEach(todo => {
    if (todo.category === "toDo") {
      document.getElementById("toDo").innerHTML += generateTodoHTML(todo);
    } else if (todo.category === "inProgress") {
      document.getElementById("inProgress").innerHTML += generateTodoHTML(todo);
    } else if (todo.category === "awaitFeedback") {
      document.getElementById("awaitFeedback").innerHTML += generateTodoHTML(todo);
    } else if (todo.category === "done") {
      document.getElementById("done").innerHTML += generateTodoHTML(todo);
    }
  });
}  