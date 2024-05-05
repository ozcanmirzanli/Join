function addNewConatct(){
    let addContact = document.getElementById("addContact");
    addContact.classList.add("addContact");
    addContact.innerHTML = /*html*/`
            <section class="addContactLeft">
                <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
                <h1>AddContact</h1><h2>Tasks are better with a Team!</h2><div class="vector"></div>
            </section>
            <section class="addContactRigth">
            <div class="inputarea">
                <img src="./assets/img/Group 13.png" alt="" class="addInitials">
            <div class="inputFields">
                <div class="input"><input type="text" placeholder="Name"><img src="./assets/img/input_name.png" alt=""></div>
                <div class="input"><input type="e-mail" placeholder="E-Mail"><img src="./assets/img/mail.png" alt=""></div>
                <div class="input"><input type="number" placeholder="Telefonnummer"><img src="./assets/img/call.png" alt=""></div>
            </div>
            </div>
                <div class="buttonArea">
                    <img src="./assets/img/cancel.png" alt="" class="cancel">
                    <img src="./assets/img/Primary check button.png" alt="" class="create">
                </div>
            </section>      
    `
}