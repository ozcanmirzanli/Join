let contacts = [];
let firstLetters = [];

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

function addNewContact() {
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
  let index = contacts.length - 1;*
  getOverview(index);
  renderContacts();
  closeAddContact();

  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  if (!firstLetters.includes(firstNameInitial)) {
    firstLetters.push(firstNameInitial);
  }
}

function closeAddContact() {
  let addContact = document.getElementById("addContact");
  addContact.classList.add("d-none");
  addContact.classList.remove("addContact");
}

function renderContacts() {
  let overview = document.getElementById("allContacts");
  overview.innerHTML = "";

  // Setze die ID jedes Kontakts auf den Array-Index, falls noch nicht gesetzt
  contacts.forEach((contact, index) => {
    if (!contact.hasOwnProperty('id')) {
      contact.id = index;
    }
  });

  // Sortiere die Kontakte alphabetisch nach dem Namen
  contacts.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  // Initialisiere ein Objekt, um die Kontakte nach dem ersten Buchstaben ihres Namens zu gruppieren
  let contactsByFirstLetter = {};

  // Gruppiere die Kontakte nach dem ersten Buchstaben ihres Namens
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!(firstLetter in contactsByFirstLetter)) {
      contactsByFirstLetter[firstLetter] = [];
    }
    contactsByFirstLetter[firstLetter].push(contact);
  }

  // Rufe die Buchstabenkategorien-Funktion für jeden Buchstaben auf und füge sie dem DOM hinzu
  for (let letter in contactsByFirstLetter) {
    overview.innerHTML += generateLettersCategoriesHTML(letter);

    // Rufe die Render-Funktion für die Kontakte jedes Buchstabens auf
    renderContactsByLetter(letter, contactsByFirstLetter[letter]);
  }
}

// Funktion zum Rendern der Kontakte für jeden Buchstaben
function renderContactsByLetter(letter, contacts) {
  let container = document.getElementById(`contactsList${letter}`);

  contacts.forEach(function (contact) {
    container.innerHTML += /*html*/ `
      <div class="contactSmall" onclick="getOverview(${contact.id})">
        <div class="initials" style="background-color: ${contact.color};">${contact.initials}</div>
        <div class="contactInfo">
          <div class="name">${contact.name}</div>
          <div class="mail">${contact.email}</div>
        </div>
      </div>
    `;
  });
}

function generateLettersCategoriesHTML(firstLetter) {
  return /*HTML*/ `
                  <div id="container${firstLetter}">
                      <div>${firstLetter}</div>
                      <div class="contactsSeperator"></div>
                      <div id="contactsList${firstLetter}"></div>
                  </div>
                  `;
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

function getOverview(contactId) {
  let contact = contacts.find(contact => contact.id === contactId);
  document.getElementById("contactBig").classList.remove("d-none");
  document.getElementById("contactBig").innerHTML = /*html*/ `
  <div class="upperArea">
    <div class="initialsBig" style="background-color: ${contact["color"]};">${contact["initials"]}</div>
      <div>
        <div class="nameArea">
          <div class="nameBig">${contact["name"]}</div>
            <div class="btnArea">
              <div class="deleteBtnContact" onclick="editContact(${contactId})">
                <img src="./assets/img/edit.svg" alt="" class="imgEdit"/>Edit
              </div>
              <div class="deleteBtnContact" onclick="deleteContact(${contactId})">
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

async function deleteContact(contactId) {
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index !== -1) {
    contacts.splice(index, 1);
    await setItem("contact", JSON.stringify(contacts));
    await getContact();
    closeAddContact();
    closeOverview();
    renderContacts();
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}

function editContact(contactId) {
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index !== -1) {
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
          <button class="deleteBtnEdit" onclick="deleteContact(${contactId})">
            <p class="deleteBtnEditText">Delete</p>
          </button>
          <button class="saveBtn" onclick="saveEditedContact(${contactId})">
            <p class="saveBtnText">Save</p>
            <img src="./assets/img/check.png" alt="" style="width: 20px; height: 18px;"/>
          </button>
        </div>
      </section>`;

    // Speichere die aktuelle Farbe des Kontakts in einem versteckten Feld
    document.getElementById("badgeColor").value = contact.color;
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}

async function saveEditedContact(contactId) {
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index !== -1) {
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

    // Extrahiere den ersten Buchstaben des bearbeiteten Vornamens des Kontakts und aktualisiere das Array
    const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
    const oldInitials = contacts[index]["initials"];
    const oldInitialsIndex = firstLetters.indexOf(oldInitials);
    if (oldInitialsIndex !== -1) {
      firstLetters.splice(oldInitialsIndex, 1); // Entferne alte Initialen aus dem Array
    }
    if (!firstLetters.includes(firstNameInitial)) {
      firstLetters.push(firstNameInitial); // Füge neue Initialen dem Array hinzu
    }
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}
