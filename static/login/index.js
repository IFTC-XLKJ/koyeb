const { response } = require("express");

const loginForm = document.getElementById("loginForm");
const user = document.getElementById("user");
const password = document.getElementById("password");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`/api/user/login?user=${encodeURIComponent(user.value)}&password=${encodeURIComponent(password.value)}`);
        const data = await response.json();
        if (response.ok) {
            if (data.code == 200) {
                alert("登录成功");
                location.href = "/";
            } else {
                alert("登录失败，原因：" + data.msg);
            }
        } else {
            alert("登录失败，原因：" + data.msg);
        }
    } catch (error) {
        alert("登录失败，原因：" + error);
    }
});