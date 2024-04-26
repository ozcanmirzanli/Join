let users = [];

let userName = document.getElementById("user-name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let signUpBtn = document.getElementById("sign-up-btn");

async function signUp() {
  signUpBtn.disabled = true;

  users.push({
    userName: userName.value,
    email: email.value,
    password: password.value,
  });

  await setItem("users", JSON.stringify(users));
  resetForm();
}

function resetForm() {
  userName.value = "";
  email.value = "";
  password.value = "";
  signUpBtn.disabled = false;
}
