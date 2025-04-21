const bindqqForm = document.getElementById("bindqqForm");
const user = document.getElementById("user");
const password = document.getElementById("password");
const qq = document.getElementById("qq");

bindqqForm.addEventListener("submit", async e => {
    e preventDefault();
    try {
        const response = await fetch(`/api/bindqq?ID=${user.value}&QQ=${qq.value)}&password=${encodeURIComponent(password.value)}`);
        const data = await response.json();
        if (response.ok) {
            if (data.code == 200) {
                const uuid = data.uuid;
                alert(`请求绑定QQ成功，请加入官群(870350184)，并通过 @VV助手 /登录 ${uuid}`);
            } else {
                alert("请求绑定QQ失败，原因：" + data.msg);
            }
    } catch(e) {
        alert(`请求绑定QQ出错：${e.message}`);
        console.log(e);
    }
})