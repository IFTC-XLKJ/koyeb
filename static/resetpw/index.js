const resetpwForm = document.getElementById("resetpwForm");
const email = document.getElementById("email");
const ID = document.getElementById("ID");
const password = document.getElementById("password");
// alert("由于点鸭邮局的邮箱服务器炸了，导致无法发送邮件，请联系管理员QQ:3164417130重置密码");
// location.reload();

ID.addEventListener("input", () => {
    if (ID.value < 0) {
        ID.value = 0;
    }
});

resetpwForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    globalThis.password = password.value;
    try {
        const response = await fetch(`/api/user/resetpassword?email=${encodeURIComponent(email.value.trim())}&ID=${ID.value}&password=${encodeURIComponent(password.value)}`);
        const data = await response.json();
        if (response.ok) {
            if (data.code == 200) {
                alert("重置密码的邮件已发送，请检查邮箱");
            } else {
                alert("重置密码失败，原因：" + data.msg);
            }
        } else {
            alert("重置密码失败，原因：" + data.msg);
        }
    } catch (error) {
        alert("重置密码失败，原因：" + error);
    }
});