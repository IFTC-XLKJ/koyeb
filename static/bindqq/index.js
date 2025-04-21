const bindqqForm = document.getElementById("bindqqForm");
const user = document.getElementById("user");
const password = document.getElementById("password");
const qq = document.getElementById("qq");

bindqqForm.addEventListener("submit", async e => {
    e preventDefault();
    try {
        const response = await fetch(`/api/bindqq?ID=${user.value}&QQ=${qq.value)}&password=${encodeURIComponent(password.value)}`);
        const data = await response.json();
        
    } catch(e) {
        alert(`请求绑定QQ出错：${e.message}`);
        console.log(e);
    }
})