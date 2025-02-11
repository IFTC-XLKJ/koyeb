const resetpwForm = document.getElementById("resetpwForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

resetpwForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    globalThis.password = password.value;
});