let contacts = [];

let colors = [
  "#FF7A00",
  "#9327FF",
  "#6E52FF",
  "#FC71FF",
  "#FFBB2B",
  "rgb(31,215,193)",
  "rgb(70,47,138)",
  "rgb(255,70,70)",
  "rgb(0,190,232)",
  "rgb(255,122,0)",
];

async function init() {
  await getContact();
  renderContacts();
}

async function getContact() {
  try {
    contacts = JSON.parse(await getItem("contact"));
  } catch (error) {
    console.info("Could not load contacts");
  }
}

function addNewConatct() {
  let addContact = document.getElementById("addContact");
  addContact.classList.remove("d-none");
  addContact.classList.add("addContact");
  let addBtn = document.querySelector(".addBtn");
  addBtn.style.backgroundColor = "rgb(9,25,49)";
  addContact.innerHTML = /*html*/ `
            <section class="addContactLeft">
                <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
                <h1>AddContact</h1><h2>Tasks are better with a Team!</h2><div class="vector"></div>
            </section>
            <section class="addContactRigth">
            <div class="close"><img src="./assets/img/Close.png" alt="" onclick="closeAddContact()"></div>
            <div class="inputarea">
                <img src="./assets/img/Group 13.png" alt="" class="addInitials">
            <form class="inputFields">
                <div class="input"><input type="text" placeholder="Name" id="name"><img src="./assets/img/input_name.png" alt="" class="inputImg"></div>
                <div class="input"><input type="e-mail" placeholder="E-Mail" id="mail"><img src="./assets/img/mail.png" alt="" class="inputImg"></div>
                <div class="input"><input type="number" placeholder="Telefonnummer" id="number"><img src="./assets/img/call.png" alt="" class="inputImg"></div>
            </form>
            </div>
            <div class="btnArea" style= "margin-top: 80px;" >
               <button class="addContactCancel" onclick="closeAddContact()">
               <p class="cancelText">Cancel</p><img src="./assets/img/Close.png" alt="" class="close">
               </button>
               <button class="addContactSave" onclick="saveContact()">
               <p class="saveText">Create Contact</p>
              <img src="./assets/img/check.png" alt="" style="width: 20px; height: 18px;"/>
              </button>
            </div>
            </section>      
    `;
}

async function saveContact() {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let number = document.getElementById("number").value;
  let color = colors[Math.floor(Math.random() * colors.length)];
  let nameParts = name.split(" ");
  let initials = getInitials(name);
  contacts.push({
    name: name,
    email: mail,
    number: number,
    color: color,
    initials: initials,
  });
  await setItem("contact", JSON.stringify(contacts));
  let index = contacts.length - 1;
  getOverview(index);
  renderContacts();
  closeAddContact();
}

function closeAddContact() {
  let addContact = document.getElementById("addContact");
  addContact.classList.add("d-none");
  addContact.classList.remove("addContact");
}

function renderContacts() {
  let overview = document.getElementById("allContacts");
  overview.innerHTML = "";

  contacts.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index];

    overview.innerHTML += /*html*/ `
    <div class="contactSmall" onclick="getOverview(${index})">
            <div class="initials" style="background-color: ${contact["color"]};">${contact["initials"]}</div>
            <div class="contactInfo">
                <div class="name">${contact["name"]}</div>
                <div class="mail">${contact["email"]}</div>
           </div>
           </div>
        `;
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

contacts.forEach(function (contact) {
  contact.initials = getInitials(contact.name);
});

function getOverview(index) {
  let contact = contacts[index];
  document.getElementById("contactBig").classList.remove("d-none");
  document.getElementById("contactBig").innerHTML = /*html*/ `
  <div class="upperArea">
    <div class="initialsBig" style="background-color: ${contact["color"]};">${contact["initials"]}</div>
      <div>
        <div class="nameArea">
          <div class="nameBig">${contact["name"]}</div>
            <div class="btnArea">
              <div class="deleteBtnContact" onclick="editContact(${index})">
                <img src="./assets/img/edit.svg" alt="" class="imgEdit"/>Edit
              </div>
              <div class="deleteBtnContact" onclick="deleteContact(${index})">
                <img src="./assets/img/delete.png" alt="" class="imgDelete" />Delete
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="infoHead">Contact Information</div>
    <div class="contactdetails">
      <div class="contactDetailsInfo">
        <div class="mailHead">E-Mail</div>
        <div style="background-color: background: #007CEE;" class="email">${contact["email"]}</div>
      </div>
      <div class="contactDetailsInfo">
        <div class="mailHead">Phone</div>
        <div>${contact["number"]}</div>
      </div>
    </div>
  `;
}

function closeOverview() {
  document.getElementById("contactBig").classList.add("d-none");
}

async function deleteContact(index) {
  contacts.splice(index, 1);
  await setItem("contact", JSON.stringify(contacts));
  await getContact();
  closeAddContact();
  closeOverview();
  renderContacts();
}

function editContact(index) {
  let contact = contacts[index];
  let addContact = document.getElementById("addContact");
  addContact.classList.remove("d-none");
  addContact.classList.add("addContact");

  addContact.innerHTML = /*html*/ `
  <section class="addContactLeft">
  <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
  <h1>Edit Contact</h1><div class="vector"></div>
</section>
<section class="addContactRigth">
<div class="close"><img src="./assets/img/Close.png" alt="" onclick="closeAddContact()"></div>
<div class="inputarea">
  <img src="./assets/img/Group 13.png" alt="" class="addInitials">
<div class="inputFields">
  <div class="input"><input type="text" placeholder="Name" id="name" value="${contact["name"]}"><img src="./assets/img/input_name.png" alt="" class="inputImg"></div>
  <div class="input"><input type="e-mail" placeholder="E-Mail" id="mail" value="${contact["email"]}"><img src="./assets/img/mail.png" alt="" class="inputImg"></div>
  <div class="input"><input type="number" placeholder="Telefonnummer" id="number" value="${contact["number"]}"><img src="./assets/img/call.png" alt="" class="inputImg"></div>
</div>
</div>
<div class="btnArea" style= "margin-top: 80px;" >
<button class="deleteBtnEdit" onclick="deleteContact(${index})">
             <p class="deleteBtnEditText">Delete</p>
    </button>
    <button class="saveBtn" onclick="saveEditedContact(${index})">
      <p class="saveBtnText">Save</p>
             <img src="./assets/img/check.png" alt="" style="width: 20px; height: 18px;"/>
    </button>
</div>
</section>`;
}

async function saveEditedContact(index) {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let number = document.getElementById("number").value;
  let color = colors[Math.floor(Math.random() * colors.length)];
  let nameParts = name.split(" ");
  let initials = getInitials(name);
  contacts[index]["name"] = name;
  contacts[index]["email"] = mail;
  contacts[index]["number"] = number;
  contacts[index]["color"] = color;
  contacts[index]["initials"] = initials;
  await setItem("contact", JSON.stringify(contacts));
  renderContacts();
  closeAddContact();
}
