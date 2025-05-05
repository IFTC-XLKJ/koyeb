const toast = new Toast();
create.addEventListener("click", async () => {
    if (localStorage.getItem("ID") && localStorage.getItem("password")) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".js";
        input.addEventListener("change", async e => {
            const file = e.target.files[0];
            if (file) {
                const loadid = toast.showToast("正在创建云函数", 0, "center", "small", "loading", false, false);
                const formData = new FormData();
                formData.append("path", "vv/cloudfun");
                formData.append("file", file);
                const response = await fetch("https://api.pgaot.com/user/up_cat_file", {
                    method: "POST",
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    return;
                }
                toast.hideToast(loadid);
                toast.showToast("上传失败", 2, "center", "small", "error", false, true);
            }
        });
        input.click();
        // const json = await fetch(`https://iftc.koyeb.app/api/cloudfun/new?ID=${localStorage.getItem("ID")}&password=${encodeURIComponent(localStorage.getItem("password"))}&file=${}}`);
    } else {
        toast.showToast("请先登录", 2, "center", "small", "error", false, true);
        return;
    }
});