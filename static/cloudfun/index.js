const toast = new Toast();
create.addEventListener("click", async () => {
    toast.showToast("正在创建云函数", 0, "center", "small", "loadding", null, true);
    if (localStorage.getItem("ID") && localStorage.getItem("password")) {

    } else {
        toast.showToast("请先登录", 2, "center", "small", "error", null, true);
        return;
    }
});