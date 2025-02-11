const registerForm = document.getElementById("registerForm");
const user = document.getElementById("user");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const email = document.getElementById("email");
const emailVerifyCode = document.getElementById("emailVerifyCode");
const getCode = document.getElementById("getCode");
const avatar = document.getElementById("avatar");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (password.value != confirmPassword.value) {
        alert("两次输入的密码不一致");
    }
});

getCode.addEventListener("click", async (e) => {
    if (email.value.trim() == "") {
        alert("请输入邮箱");
        return;
    }
    const regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!regex.test(email.value.trim())) {
        alert("请输入正确的邮箱");
        return;
    }
});