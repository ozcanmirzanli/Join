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
  let addContact = document.getElementById("add-contact-bg");
  addContact.style.display = "flex";

  let addBtn = document.querySelector(".add-btn");
  addBtn.style.backgroundColor = "rgb(9,25,49)";
  document.getElementById("add-contact").innerHTML = generateAddContactHTML();
}

function generateAddContactHTML() {
  return /*html*/ `
  <div class="add-contact-container">
  <div class="add-contact-left">
    <div class="add-contact-left-container">
  <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
  <h1>AddContact</h1><h2>Tasks are better with a Team!</h2>
  <div class="vector"></div>
  </div>
  </div>
  <div class="add-contact-right">
  <div class="add-contact-close-btn"><img src="./assets/img/Close.png" alt="" onclick="closePopUp()"></div>

    <div class="add-contact-right-container">
  <div class="input-area">
  <img src="./assets/img/Group 13.png" alt="" class="contact-picture">
  ${generateAddContactInputsHTML()}
  </div>
  </div>
  </div>`;
}

function generateAddContactInputsHTML() {
  return /*html*/ `
  <form class="input-fields">
  <div class="input-container"><input type="text" placeholder="Name" id="name"><img src="./assets/img/input_name.png" alt="" class="inputImg"></div>
  <div class="input-container"><input type="e-mail" placeholder="Email" id="mail"><img src="./assets/img/mail.png" alt="" class="inputImg"></div>
  <div class="input-container"><input type="number" placeholder="Phone" id="number"><img src="./assets/img/call.png" alt="" class="inputImg"></div>
  ${generateAddContactButtonsHTML()};
  </form>`;
}

function generateAddContactButtonsHTML() {
  return /*html*/ `
  <div class="add-contact-btns" >
     <button class="add-contact-cancel" onclick="closePopUp()">
     <p class="cancelText">Cancel</p><img src="./assets/img/Close.png" alt="" class="close">
     </button>
     <button class="add-contact-create" onclick="saveContact(event)">
     <p class="save-text">Create Contact</p>
    <img src="./assets/img/check.png" alt="" style="width: 20px; height: 18px;"/>
    </button>
  </div>
  </div> 
  `;
}

async function saveContact(event) {
  event.preventDefault();

  let contact = createContact();
  contacts.push(contact);
  await saveContacts();
  updateUI(contacts.length - 1);
  addFirstLetter(contact.name);
  closePopUp();
}

function createContact() {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let number = document.getElementById("number").value;
  let color = colors[Math.floor(Math.random() * colors.length)];
  let initials = getInitials(name);
  let id = contacts.length > 0 ? contacts[contacts.length - 1].id + 1 : 0;
  return { name, email: mail, number, color, initials, id };
}

async function saveContacts() {
  await setItem("contact", JSON.stringify(contacts));
}

function updateUI(index) {
  getOverview(index);
  renderContacts();
  closePopUp();
}

function addFirstLetter(name) {
  let firstNameInitial = name.split(" ")[0].charAt(0).toUpperCase();
  if (!firstLetters.includes(firstNameInitial)) {
    firstLetters.push(firstNameInitial);
  }
}

function closePopUp() {
  let addContact = document.getElementById("add-contact-bg");
  addContact.style.display = "none";

  let editContact = document.getElementById("edit-contact-bg");
  editContact.style.display = "none";
}

function renderContacts() {
  let overview = document.getElementById("all-contacts");
  overview.innerHTML = "";

  setContactIds();
  sortContacts();
  // Initialisiere ein Objekt, um die Kontakte nach dem ersten Buchstaben ihres Namens zu gruppieren
  let contactsByFirstLetter = groupContactsByFirstLetter();

  // Rufe die Buchstabenkategorien-Funktion für jeden Buchstaben auf und füge sie dem DOM hinzu
  for (let letter in contactsByFirstLetter) {
    overview.innerHTML += generateLettersCategoriesHTML(letter);
    // Rufe die Render-Funktion für die Kontakte jedes Buchstabens auf
    renderContactsByLetter(letter, contactsByFirstLetter[letter]);
  }
}

function setContactIds() {
  // Setze die ID jedes Kontakts auf den Array-Index, falls noch nicht gesetzt
  contacts.forEach((contact, index) => {
    if (!contact.hasOwnProperty("id")) {
      contact.id = index;
    }
  });
}

function sortContacts() {
  // Sortiere die Kontakte alphabetisch nach dem Namen
  contacts.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

function groupContactsByFirstLetter() {
  let contactsByFirstLetter = {};
  // Gruppiere die Kontakte nach dem ersten Buchstaben ihres Namens
  contacts.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!contactsByFirstLetter[firstLetter]) {
      contactsByFirstLetter[firstLetter] = [];
    }
    contactsByFirstLetter[firstLetter].push(contact);
  });
  return contactsByFirstLetter;
}

// Funktion zum Rendern der Kontakte für jeden Buchstaben
function renderContactsByLetter(letter, contacts) {
  let container = document.getElementById(`contactsList${letter}`);

  contacts.forEach(function (contact) {
    container.innerHTML += generateSmallContactHTML(contact);
  });
}

function generateSmallContactHTML(contact) {
  return /*html*/ `
  <div class="contactSmall" data-id="${contact.id}" onclick="getOverview(${contact.id})">
    <div class="initials" style="background-color: ${contact.color};">${contact.initials}</div>
    <div class="contactInfo">
      <div class="name">${contact.name}</div>
      <div class="mail">${contact.email}</div>
    </div>
  </div>
`;
}

function generateLettersCategoriesHTML(firstLetter) {
  return /*html*/ `
   <div id="container${firstLetter}">
      <div class="container-letter">${firstLetter}</div>
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

function getOverview(contactId, index = null) {
  let contact = contacts.find((contact) => contact.id === contactId);
  displayContactDetails(contact);
  changeContactColor(contactId);
  if (index !== null) {
    updateUI(index);
  }
}

function displayContactDetails(contact) {
  let contactBig = document.getElementById("contactBig");
  contactBig.classList.remove("d-none");
  contactBig.innerHTML = generateContactDetailsHTML(contact);
}

// prettier-ignore
function generateContactDetailsHTML(contact) {
  return /*html*/ `
    <div class="upperArea">
      <div class="initialsBig" style="background-color: ${contact.color};">${contact.initials}</div>
      <div>
     ${generateContactNameAreaHTML(contact)}
      </div>
    </div>
    <div class="infoHead">Contact Information</div>
    <div class="contactdetails">
      ${generateContactDetailsInfo(contact)}
    </div>
  `;
}

function generateContactNameAreaHTML(contact) {
  return /*html*/ `
  <div class="nameArea">
  <div class="nameBig">${contact.name}</div>
  <div class="add-contact-btns">
    <div class="deleteBtnContact" onclick="editContact(${contact.id})">
      <img src="./assets/img/edit.svg" alt="" class="imgEdit"/>Edit
    </div>
    <div class="deleteBtnContact" onclick="deleteContact(${contact.id})">
      <img src="./assets/img/delete.png" alt="" class="imgDelete" />Delete
    </div>
  </div>
</div>
`;
}

function generateContactDetailsInfo(contact) {
  return /*html*/ `
    <div class="contactDetailsInfo">
      <div class="mailHead">Email</div>
      <div style="background-color: background: #007CEE;" class="email">${contact.email}</div>
    </div>
    <div class="contactDetailsInfo">
      <div class="mailHead">Phone</div>
      <div>${contact.number}</div>
    </div>
  `;
}

function changeContactColor(contactId) {
  let allContacts = document.querySelectorAll(".contactSmall");
  allContacts.forEach((contact) => {
    if (contact.getAttribute("data-id") == contactId) {
      contact.classList.add("contact-list-active");
    } else {
      contact.classList.remove("contact-list-active");
    }
  });
}

function changeContactColor(contactId) {
  let allContacts = document.querySelectorAll(".contactSmall");

  allContacts.forEach((contact) => {
    if (contact.getAttribute("data-id") == contactId) {
      contact.classList.add("contact-list-active");
    } else {
      contact.classList.remove("contact-list-active");
    }
  });
}

function closeOverview() {
  document.getElementById("contactBig").classList.add("d-none");
}

async function deleteContact(contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    contacts.splice(index, 1);
    await setItem("contact", JSON.stringify(contacts));
    await getContact();
    closePopUp();
    closeOverview();
    renderContacts();
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}

function editContact(contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    let contact = contacts[index];
    displayEditContactForm(contact);
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}

function displayEditContactForm(contact) {
  let editContact = document.getElementById("edit-contact-bg");
  editContact.style.display = "flex";
  editContact.innerHTML = generateEditContactHTML(contact);
  document.getElementById("badgeColor").value = contact.color;
}

function generateEditContactHTML(contact) {
  return /*html*/ `
  <div class="edit-contact-container">
    <div class="edit-contact-left">
    <div class="edit-contact-left-container">
      <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
      <h1>Edit Contact</h1><div class="vector"></div>
      </div>
</div>
    <div class="edit-contact-right">
    <div class="add-contact-close-btn"><img src="./assets/img/Close.png" alt="" onclick="closePopUp()"></div>
      <div class="edit-contact-right-container">
      <div class="input-area">
        <img src="./assets/img/Group 13.png" alt="" class="contact-picture">
        ${generateEditContactInputsHTML(contact)}
      </div>
      </div>
</div>
</div>`;
}

function generateEditContactInputsHTML(contact) {
  return /*html*/ `
    <div class="input-fields">
      <div class="input-container">
        <input type="text" placeholder="Name" id="name" value="${contact.name}">
        <img src="./assets/img/input_name.png" alt="" class="input-img">
      </div>
      <div class="input-container">
        <input type="e-mail" placeholder="E-Mail" id="mail" value="${
          contact.email
        }">
        <img src="./assets/img/mail.png" alt="" class="input-img">
      </div>
      <div class="input-container">
        <input type="number" placeholder="Telefonnummer" id="number" value="${
          contact.number
        }">
        <img src="./assets/img/call.png" alt="" class="input-img">
      </div>
      ${generateEditContactButtonsHTML(contact.id)}
    </div>`;
}

function generateEditContactButtonsHTML(contactId) {
  return /*html*/ `
  <div class="edit-contact-btns">
      <button class="edit-contact-delete" onclick="deleteContact(${contactId})">
        <p class="deleteBtnEditText">Delete</p>
      </button>
      <button class="edit-contact-save" onclick="saveEditedContact(${contactId})">
        <p class="saveBtnText">Save</p>
        <img src="./assets/img/check.png" alt="" style="width: 20px; height: 18px;"/>
      </button>
    </div>`;
}

async function saveEditedContact(contactId) {
  const index = findContactIndex(contactId);

  if (index !== -1) {
    updateContactDetails(index);
    await saveContactsToStorage();
    renderContacts();
    closePopUp();
    updateFirstLettersAfterEdit(index);
    getOverview(contactId);
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}

function findContactIndex(contactId) {
  return contacts.findIndex((contact) => contact.id === contactId);
}

function updateContactDetails(index) {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let number = document.getElementById("number").value;
  let color = colors[Math.floor(Math.random() * colors.length)];
  let initials = getInitials(name);

  contacts[index]["name"] = name;
  contacts[index]["email"] = mail;
  contacts[index]["number"] = number;
  contacts[index]["color"] = color;
  contacts[index]["initials"] = initials;
}

async function saveContactsToStorage() {
  await setItem("contact", JSON.stringify(contacts));
}

function updateFirstLettersAfterEdit(index) {
  let name = document.getElementById("name").value;
  let nameParts = name.split(" ");
  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  const oldInitials = contacts[index]["initials"];
  const oldInitialsIndex = firstLetters.indexOf(oldInitials);

  if (oldInitialsIndex !== -1) {
    firstLetters.splice(oldInitialsIndex, 1);
  }

  if (!firstLetters.includes(firstNameInitial)) {
    firstLetters.push(firstNameInitial);
  }
}
