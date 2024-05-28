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

/**
 * Initialize the application by loading contacts and rendering them.
 */
async function init() {
  await getContact();
  await initHeader();
  renderContacts();
}

/**
 * Retrieve contacts from storage.
 */
async function getContact() {
  try {
    contacts = JSON.parse(await getItem("contact"));
  } catch (error) {
    console.info("Could not load contacts");
  }
}

/**
 * Display the form to add a new contact.
 */
function addNewContact() {
  let addContact = document.getElementById("add-contact-bg");
  addContact.style.display = "flex";

  let addBtn = document.querySelector(".add-btn");
  addBtn.style.backgroundColor = "rgb(9,25,49)";
  document.getElementById("add-contact").innerHTML = generateAddContactHTML();
  removeScrollingOnNumberInput();
}

/**
 * Save a new contact.
 * @param {Event} event - The form submit event.
 */
async function saveContact(event) {
  event.preventDefault();

  let contact = createContact();
  contacts.push(contact);
  await saveContacts();
  updateUI(contacts.length - 1);
  addFirstLetter(contact.name);
  closePopUp();
}

/**
 * Create a new contact object.
 * @returns {Object} - The newly created contact object.
 */
function createContact() {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let number = document.getElementById("number").value;
  let color = colors[Math.floor(Math.random() * colors.length)];
  let initials = getInitials(name);
  let id = Date.now();
  return { name, email: mail, number, color, initials, id };
}

/**
 * Save contacts to storage.
 */
async function saveContacts() {
  await setItem("contact", JSON.stringify(contacts));
}

/**
 * Update the UI after saving a contact.
 * @param {number} index - The index of the newly added contact.
 */
function updateUI(index) {
  getOverview(index);
  renderContacts();
  closePopUp();
}

/**
 * Add the first letter of a contact's name to the list of first letters.
 * @param {string} name - The contact's name.
 */
function addFirstLetter(name) {
  let firstNameInitial = name.split(" ")[0].charAt(0).toUpperCase();
  if (!firstLetters.includes(firstNameInitial)) {
    firstLetters.push(firstNameInitial);
  }
}

/**
 * Close any open pop-up forms.
 */
function closePopUp() {
  let addContact = document.getElementById("add-contact-bg");
  addContact.style.display = "none";

  let editContact = document.getElementById("edit-contact-bg");
  editContact.style.display = "none";
}

/**
 * Render all contacts.
 */
function renderContacts() {
  let overview = document.getElementById("all-contacts");
  overview.innerHTML = "";

  setContactIds();
  sortContacts();
  let contactsByFirstLetter = groupContactsByFirstLetter();

  for (let letter in contactsByFirstLetter) {
    overview.innerHTML += generateLettersCategoriesHTML(letter);
    renderContactsByLetter(letter, contactsByFirstLetter[letter]);
  }
}

/**
 * Set IDs for contacts if not already set.
 */
function setContactIds() {
  // Setze die ID jedes Kontakts auf den Array-Index, falls noch nicht gesetzt
  contacts.forEach((contact, index) => {
    if (!contact.hasOwnProperty("id")) {
      contact.id = index;
    }
  });
}

/**
 * Sort contacts alphabetically by name.
 */
function sortContacts() {
  contacts.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

/**
 * Group contacts by the first letter of their name.
 * @returns {Object} - An object with letters as keys and arrays of contacts as values.
 */
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

/**
 * Render contacts for a specific letter.
 * @param {string} letter - The letter to group by.
 * @param {Array} contacts - The list of contacts to render.
 */
function renderContactsByLetter(letter, contacts) {
  let container = document.getElementById(`contactsList${letter}`);

  contacts.forEach(function (contact) {
    container.innerHTML += generateSmallContactHTML(contact);
  });
}

/**
 * Get the initials from a name.
 * @param {string} name - The full name.
 * @returns {string} - The initials.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

contacts.forEach(function (contact) {
  contact.initials = getInitials(contact.name);
});

/**
 * Get the overview of a contact.
 * @param {number} contactId - The ID of the contact.
 * @param {number} [index=null] - The index of the contact.
 */
function getOverview(contactId, index = null) {
  let contact = contacts.find((contact) => contact.id === contactId);
  displayContactDetails(contact);
  changeContactColor(contactId);
  if (index !== null) {
    updateUI(index);
  }
}

/**
 * Display the details of a contact.
 * @param {Object} contact - The contact object.
 */
function displayContactDetails(contact) {
  let contactBig = document.getElementById("contactBig");
  let contactOverview = document.querySelector(".right-section");

  contactBig.classList.remove("d-none");
  // Check if the contact object is valid and contains the color property
  if (contact && contact.color) {
    contactBig.innerHTML = generateContactDetailsHTML(contact);
  } else {
    console.error("Invalid contact object or missing color property");
  }

  contactOverview.style.display = "block";
}

/**
 * Change the color of the contact element in the list.
 * @param {number} contactId - The ID of the contact.
 */
function changeContactColor(contactId) {
  let allContacts = document.querySelectorAll(".contactSmall");
  if (window.innerWidth > 630) {
    allContacts.forEach((contact) => {
      if (contact.getAttribute("data-id") == contactId) {
        contact.classList.add("contact-list-active");
      } else {
        contact.classList.remove("contact-list-active");
      }
    });
  }
}

/**
 * Close the detailed overview of a contact.
 */
function closeOverview() {
  document.getElementById("contactBig").classList.add("d-none");
}

/**
 * Delete a contact by ID.
 * @param {number} contactId - The ID of the contact to delete.
 */
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

/**
 * Edit a contact by ID.
 * @param {number} contactId - The ID of the contact to edit.
 */
function editContact(contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    let contact = contacts[index];
    displayEditContactForm(contact);
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}

/**
 * Display the form to edit a contact.
 * @param {Object} contact - The contact object to edit.
 */
function displayEditContactForm(contact) {
  let editContact = document.getElementById("edit-contact-bg");
  editContact.style.display = "flex";
  editContact.innerHTML = generateEditContactHTML(contact);
  document.getElementById("badgeColor").value = contact.color;
}

/**
 * Save the edited contact.
 * @param {number} contactId - The ID of the contact to save.
 */
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

/**
 * Find the index of a contact by ID.
 * @param {number} contactId - The ID of the contact.
 * @returns {number} - The index of the contact.
 */
function findContactIndex(contactId) {
  return contacts.findIndex((contact) => contact.id === contactId);
}

/**
 * Update the details of a contact.
 * @param {number} index - The index of the contact to update.
 */
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

function removeScrollingOnNumberInput() {
  document.querySelectorAll('input[type="number"]').forEach(function (input) {
    input.addEventListener("wheel", function (event) {
      event.preventDefault();
    });
  });
}

function closeContactOverview() {
  document.querySelector(".right-section").style.display = "none";
}

document.addEventListener("click", function (event) {
  closeContactOptions(event);
});

function showContactOptions() {
  let editBtn = document.querySelector(".edit-contact-btns");
  if (editBtn) {
    editBtn.style.display = "flex";
  }
}

function closeContactOptions(event) {
  if (window.innerWidth <= 630) {
    let editBtn = document.querySelector(".edit-contact-btns");
    if (editBtn) {
      if (
        !editBtn.contains(event.target) &&
        !event.target.closest(".contact-options-btn")
      ) {
        editBtn.style.display = "none";
      }
    }
  }
}

// Prevent clicks inside the edit button options from closing it
// prettier-ignore
document.querySelector(".edit-contact-btns").addEventListener("click", function (event) {
    event.stopPropagation();
  });
