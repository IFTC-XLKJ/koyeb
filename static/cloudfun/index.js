const toast = new Toast();
create.addEventListener("click", async () => {
    toast.showToast("正在创建云函数", 0, "loading", "custom", 0, 0, 0, 0, 0, 0, 0, 0);
    if (localStorage.getItem("ID") && localStorage.getItem("password")) {

    } else {
        toast.showToast("请先登录", 2000, "error", "custom", 0, 0, 0, 0, 0, 0, 0, 0);
        return;
    }
});