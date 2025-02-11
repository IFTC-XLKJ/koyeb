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
    if (user.value.trim().startsWith("#")) {
        alert("用户名不能以#开头");
        return;
    }
    if (password.value != confirmPassword.value) {
        alert("两次输入的密码不一致");
    }
    try {
        const response = await fetch(`/api/verifycode?email=${encodeURIComponent(email.value.trim())}&code=${encodeURIComponent(emailVerifyCode.value.trim())}`)
        if (response.ok) {
            const data = await response.json();
            if (data.code == 200) {
                globalThis.email = email.value.trim();
                try {
                    const response = await fetch(`/api/user/register?nickname=${encodeURIComponent(user.value)}&password=${encodeURIComponent(password.value)}&email=${encodeURIComponent(globalThis.email)}&avatar=${encodeURIComponent(globalThis.avatar)}`)
                    if (response.ok) {
                        const data = await response.json();
                        if (data.code != 200) {
                            alert("注册失败，原因：" + data.message);
                            return;
                        } else {
                            alert("注册成功，请登录");
                            location.href = "/login";
                        }
                    } else {
                        const data = await response.json();
                        console.log(data);
                        alert("注册失败，原因：" + response.statusText);
                    }
                } catch (error) {
                    alert("注册失败，原因：" + error);
                    return;
                }
            } else {
                alert("验证码验证失败");
            }
        } else {
            alert("验证码验证失败");
            return;
        }
    } catch (error) {
        alert("验证码验证失败");
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
        const response = await fetch(`/api/sendcode?email=${encodeURIComponent(email.value.trim())}&title=${encodeURIComponent("vv账号 - 注册验证码")}&content=${encodeURIComponent("你的验证码为 {captcha}")}`);
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
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 10) {
        alert("上传头像失败，原因：头像大小不能超过10MB");
        return;
    }
    if (!file.type.startsWith("image/") && !file.name.endsWith(".bin")) {
        alert("上传头像失败，原因：上传的文件不是图片");
        return;
    }
    try {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("path", "vv/avatar")
        const response = await fetch("https://api.pgaot.com/user/up_cat_file", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            if (data.code != 200) {
                alert("上传头像失败，原因：" + data.message);
                return;
            }
            globalThis.avatar = data.url;
            alert("上传头像成功");
        }
    } catch (error) {
        alert("上传头像失败，原因：" + error);
    }
});