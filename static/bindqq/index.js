const bindqqForm = document.getElementById("bindqqForm");
const user = document.getElementById("user");
const password = document.getElementById("password");
const qq = document.getElementById("qq");

bindqqForm.addEventListener("submit", async e => {
    e preventDefault();
    globalThis.password = password.value;
})