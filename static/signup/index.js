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
    try {
        const response = await fetch(`/api/sendcode?email=${email.value.trim()}&title=注册验证码&content=你的验证码是：" + Math.floor(Math.random() * 1000000)`, {
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
            if (data.code != 200) {
                alert("发送验证码失败，原因：" + data.message);
                return;
            }
            alert("发送验证码成功");
        } else {
            alert("发送验证码失败，原因：" + response.statusText);
        }
    } catch (error) {
        alert("发送验证码失败，原因：" + error);
    }
});

avatar.addEventListener("change", async (e) => {
    try {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("path", "vv/avatar")
    } catch (error) {
        alert("上传头像失败，原因：" + error);
    }
});