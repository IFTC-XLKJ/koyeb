const toast = new Toast();
create.addEventListener("click", async () => {
    if (localStorage.getItem("ID") && localStorage.getItem("password")) {

    } else {
        toast.showToast("请先登录", 1, "error", "custom", 0, 0, 0, 0, 0, 0, 0, 0);
        return;
    }
});