const toast = new Toast();
create.addEventListener("click", async () => {
    const loadid = toast.showToast("正在创建云函数", 0, "center", "small", "loading", false);
    if (localStorage.getItem("ID") && localStorage.getItem("password")) {

    } else {
        toast.hideToast(loadid);
        toast.showToast("请先登录", 2, "center", "small", "error", false);
        return;
    }
});