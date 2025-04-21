const bindqqForm = document.getElementById("bindqqForm");
const user = document.getElementById("user");
const password = document.getElementById("password");
const qq = document.getElementById("qq");

bindqqForm.addEventListener("submit", async e => {
    e preventDefault();
    globalThis.password = password.value;
    globalThis.qq = qq.value;
    try {} catch(e) {
        alert(`请求绑定QQ出错：${e.message}`);
        console.log(e);
    }
})