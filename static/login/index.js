console.log("登录页面全新升级");
(async function () {
    const loginForm = document.getElementById("loginForm");
    const user = document.getElementById("user");
    const password = document.getElementById("password");
    let verifyToken = null;
    globalThis.onVerifySuccess = function(token) {
        verifyToken = token;
        console.log("verify success", token);
    };

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!verifyToken) return alert("请完成验证");
        globalThis.password = password.value;
        try {
            const response = await fetch(`/api/user/login?user=${encodeURIComponent(user.value)}&password=${encodeURIComponent(password.value)}`);
            const data = await response.json();
            if (response.ok) {
                if (data.code == 200) {
                    alert("登录成功");
                    const url = new URL(location.href);
                    const page = url.searchParams.get("page") || "/";
                    await cookieStore.set("ID", data.id);
                    localStorage.setItem("ID", data.id);
                    if (globalThis.vvbrowser) {
                        console.log("VV浏览器登录设置", vvbrowser.setLogin(data.id));
                    }
                    localStorage.setItem("password", globalThis.password)
                    location.href = page;
                } else {
                    console.log(3)
                    alert("登录失败，原因：" + data.msg);
                }
            } else {
                console.log(2)
                alert("登录失败，原因：" + data.msg);
            }
        } catch (error) {
            console.log(1)
            alert("登录失败，原因：" + error);
        }
    });

    if (localStorage.getItem("ID") && localStorage.getItem("password")) {
        const url = new URL(location.href);
        const page = url.searchParams.get("page") || "/";
        location.href = page;
    }
})();