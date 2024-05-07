let contacts = [];

let colors = [
  "#FF7A002",
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
  addContact.innerHTML = /*html*/ `
            <section class="addContactLeft">
                <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
                <h1>AddContact</h1><h2>Tasks are better with a Team!</h2><div class="vector"></div>
            </section>
            <section class="addContactRigth">
            <img src="./assets/img/Close.png" alt="" class="close">
            <div class="inputarea">
                <img src="./assets/img/Group 13.png" alt="" class="addInitials">
            <div class="inputFields">
                <div class="input"><input type="text" placeholder="Name" id="name"><img src="./assets/img/input_name.png" alt="" class="inputImg"></div>
                <div class="input"><input type="e-mail" placeholder="E-Mail" id="mail"><img src="./assets/img/mail.png" alt="" class="inputImg"></div>
                <div class="input"><input type="number" placeholder="Telefonnummer" id="number"><img src="./assets/img/call.png" alt="" class="inputImg"></div>
            </div>
            </div>
            <div class="buttonArea">
                    <img src="./assets/img/cancel.png" alt="" class="cancel" class="btnCancel" onclick="closeAddContact()">
                    <img src="./assets/img/Primary check button.png" alt="" class="create" class="btnCreate" onclick="saveContact()">
                </div>
            </section>      
    `;
}

async function saveContact() {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let number = document.getElementById("number").value;
  let color = colors[Math.floor(Math.random() * colors.length)];

  contacts.push({ name: name, email: mail, number: number, color: color });
  await setItem("contact", JSON.stringify(contacts));
  closeAddContact();
}

function closeAddContact() {
  let addContact = document.getElementById("addContact");
  addContact.innerHTML = "";
  addContact.classList.add("d-none");
  addContact.classList.remove("addContact");
}

function renderContacts() {
  let overview = document.getElementById("allContacts");

  contacts.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index];
    const initials = getInitials(contact.name);

    overview.innerHTML += /*html*/ `
    <div class="contactSmall" onclick="getOverview(contacts[${index}])">
            <div class="initials" style="background-color: ${contact.color};">${initials}</div>
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

function getOverview(contact){
    document.getElementById("contactBig").classList.remove('d-none')
    document.getElementById("contactBig").innerHTML =/*html*/`
        <div class="bigInitials" style="background-color: ${contact["color"]};">${initials}</div>
            <div class="">
                <h3 class="bigName">${contact["name"]}</h3>
                <div class="btnArea">
                <img src="./assets/img/Delete contact.svg" alt="delete" onclick="deletContact()"> 
          <img src="./assets/img/edit contacts.svg" alt="edit" onclick="editContact()">
</div>
          <h2>Contact Information</h2>
                <div><h4>E-Mail</h4>${contact["email"]}</div>
                <div><h4>Phone</h4>${contact["number"]}</div>
  </div>   `
}