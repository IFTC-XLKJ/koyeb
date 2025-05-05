const toast = new Toast();
create.addEventListener("click", async () => {
    const loadid = toast.showToast("正在创建云函数", 0, "center", "small", "loading", false, false);
    if (localStorage.getItem("ID") && localStorage.getItem("password")) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".js";
        input.addEventListener("change", async e => {
        });
        input.click();
        // const json = await fetch(`https://iftc.koyeb.app/api/cloudfun/new?ID=${localStorage.getItem("ID")}&password=${encodeURIComponent(localStorage.getItem("password"))}&file=${}}`);
    } else {
        toast.hideToast(loadid);
        toast.showToast("请先登录", 2, "center", "small", "error", false, true);
        return;
    }
});