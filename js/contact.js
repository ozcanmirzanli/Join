let contact = [];

async function getContact(){
  try {
   contact = JSON.parse(await getItem("contact"));
  } catch (error) {
    console.info('Could not load contacts')
  } 
}


function addNewConatct(){
    let addContact = document.getElementById("addContact");
    addContact.classList.remove("d-none");
    addContact.classList.add("addContact");
    addContact.innerHTML = /*html*/`
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
                    <img src="./assets/img/cancel.png" alt="" class="cancel" class="btnCancel" onclick="close()">
                    <img src="./assets/img/Primary check button.png" alt="" class="create" class="btnCreate" onclick="saveContact()">
                </div>
            </section>      
    `
}

async function saveContact(){
    let name = document.getElementById("name").value;
    let mail = document.getElementById("mail").value;
    let number = document.getElementById("number").value;

    contact.push({ name: name, email: mail, number: number});
    await setItem("contact", JSON.stringify(contact));
    close();
}

function close(){
    let addContact = document.getElementById("addContact");
    addContact.innerHTML = '';
    addContact.classList.add("d-none");
    addContact.classList.remove("addContact"); 
}