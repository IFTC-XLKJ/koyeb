const resetpwForm = document.getElementById("resetpwForm");
const email = document.getElementById("email");
const ID = document.getElementById("ID");
const password = document.getElementById("password");

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