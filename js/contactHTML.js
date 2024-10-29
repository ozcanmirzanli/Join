/**
 * Generates the HTML for the "Add Contact" form.
 * @returns {string} The HTML string for the "Add Contact" form.
 */
export function generateAddContactHTML() {
  return /*html*/ `
    <div class="add-contact-container">
    <div class="add-contact-left">
    <div class="add-contact-close-mobile"><img src="./assets/img/close-white.png" alt="" onclick="closePopUp()"></div>
    <div class="add-contact-left-container">
    <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
    <h1>Add Contact</h1><h2>Tasks are better with a Team!</h2>
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

/**
 * Generates the HTML for the input fields in the "Add Contact" form.
 * @returns {string} The HTML string for the input fields in the "Add Contact" form.
 */
export function generateAddContactInputsHTML() {
  return /*html*/ `
    <form onsubmit="saveContact(event)" class="input-fields">
    <div class="input-container"><input type="text" placeholder="Name" id="name" required><img src="./assets/img/input_name.png" alt="" class="inputImg"></div>
    <div class="input-container"><input type="email" placeholder="Email" id="mail" required><img src="./assets/img/mail.png" alt="" class="inputImg"></div>
    <div class="input-container"><input type="number" placeholder="Phone" id="number"><img src="./assets/img/call.png" alt="" class="inputImg"></div>
    ${generateAddContactButtonsHTML()}
    </form>`;
}

/**
 * Generates the HTML for the buttons in the "Add Contact" form.
 * @returns {string} The HTML string for the buttons in the "Add Contact" form.
 */
export function generateAddContactButtonsHTML() {
  return /*html*/ `
    <div class="add-contact-btns" >
       <button class="add-contact-cancel" onclick="closePopUp()">
       <p class="cancelText">Cancel</p><img src="./assets/img/Close.png" alt="" class="close">
       </button>
       <button class="add-contact-create" type="submit">
       <p class="save-text">Create Contact</p>
      <img src="./assets/img/check.png" alt=""/>
      </button>
    </div>
    </div> 
    `;
}

/**
 * Generates the HTML for a small contact preview.
 */
export function generateSmallContactHTML(contact) {
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

/**
 * Generates the HTML for a letter category section.
 */
export function generateLettersCategoriesHTML(firstLetter) {
  return /*html*/ `
     <div id="container${firstLetter}">
        <div class="container-letter">${firstLetter}</div>
        <div class="contactsSeperator"></div>
        <div id="contactsList${firstLetter}"></div>
     </div>
     `;
}

/**
 * Generates the HTML for the contact details view.
 */
// prettier-ignore
export function generateContactDetailsHTML(contact) {
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

/**
 * Generates the HTML for the contact name area.
 */
export function generateContactNameAreaHTML(contact) {
  return /*html*/ `
    <div class="nameArea">
    <div class="nameBig">${contact.name}</div>
    <div class="edit-contact-btns">
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

/**
 * Generates the HTML for the contact details information.
 */
export function generateContactDetailsInfo(contact) {
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

/**
 * Generates the HTML for the "Edit Contact" form.
 */
export function generateEditContactHTML(contact) {
  return /*html*/ `
    <div class="edit-contact-container">
      <div class="edit-contact-left">
      <div class="add-contact-close-mobile"><img src="./assets/img/close-white.png" alt="" onclick="closePopUp()"></div>
      <div class="edit-contact-left-container">
        <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
        <h1>Edit Contact</h1><div class="vector"></div>
        </div>
  </div>
      <div class="edit-contact-right">
      <div class="add-contact-close-btn"><img src="./assets/img/Close.png" alt="" onclick="closePopUp()"></div>
        <div class="edit-contact-right-container">
        <div class="input-area">
          <div class="contact-picture initialsBig" style="background-color: ${
            contact.color
          };">${contact.initials}</div>
          ${generateEditContactInputsHTML(contact)}
        </div>
        </div>
  </div>
  </div>`;
}

/**
 * Generates the HTML for the input fields in the "Edit Contact" form.
 */
function generateEditContactInputsHTML(contact) {
  return /*html*/ `
      <div class="input-fields">
        <div class="input-container">
          <input type="text" placeholder="Name" id="name" value="${
            contact.name
          }">
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

/**
 * Generates the HTML for the Buttons in the "Edit Contact" form.
 */
export function generateEditContactButtonsHTML(contactId) {
  return /*html*/ `
    <div class="delete-save-btns">
        <button class="edit-contact-delete" onclick="deleteContact(${contactId})">
          <p class="deleteBtnEditText">Delete</p>
        </button>
        <button class="edit-contact-save" onclick="saveEditedContact(${contactId})">
          <p class="saveBtnText">Save</p>
          <img src="./assets/img/check.png" alt="" style="width: 20px; height: 18px;"/>
        </button>
      </div>`;
}
