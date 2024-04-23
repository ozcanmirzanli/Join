let users = [{ email: "ozcan@test.de", password: "test1234" }];

function addUser() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  users.push({ email: email, password: password });
}
