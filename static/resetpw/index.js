const resetpwForm = document.getElementById("resetpwForm");
const email = document.getElementById("email");
const ID = document.getElementById("ID");
const password = document.getElementById("password");

resetpwForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    globalThis.password = password.value;
    try {
        const response = await fetch(`/api/user/resetpassword?email=${encodeURIComponent(email.value.trim())}&ID=${encodeURIComponent(ID.value)}&password=${encodeURIComponent(password.value)}`);
        if (response.ok) {
            const data = await response.json();
            if (data.code == 200) {
                alert("重置密码的邮件已发送，请检查邮箱");
            } else {
                alert("重置密码失败，原因：" + data.message);
            }
        } else {
            alert("重置密码失败，原因：" + response.statusText);
        }
    } catch (error) {
        alert("重置密码失败，原因：" + error);
    }
});