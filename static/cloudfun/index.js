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
                formData.append("file", file, file.name);
                const response = await fetch("https://api.pgaot.com/user/up_cat_file", {
                    method: "POST",
                    body: formData,
                    redirect: 'follow'
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.code == 200) {
                        const url = data.url;
                        const response = await fetch(`/api/cloudfun/new?ID=${localStorage.getItem("ID")}&password=${encodeURIComponent(localStorage.getItem("password"))}&file=${encodeURIComponent(url)}}`);
                        const json = await response.json();
                        if (json.code == 200) {
                            toast.hideToast(loadid);
                            toast.showToast("创建成功", 2, "center", "small", "success", false, true);
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        } else if (json.code == 401) {
                            toast.hideToast(loadid);
                            toast.showToast(json.msg, 2, "center", "small", "error", false, true);
                            await wait(2000);
                            location.href = "/login";
                        } else {
                            toast.hideToast(loadid);
                            toast.showToast(json.msg, 2, "center", "small", "error", false, true);
                            await wait(2000);
                        }
                    } else {
                        toast.hideToast(loadid);
                        toast.showToast(data.msg, 2, "center", "small", "error", false, true);
                    }
                    return;
                }
                toast.hideToast(loadid);
                toast.showToast("上传失败", 2, "center", "small", "error", false, true);
            }
        });
        input.click();
    } else {
        toast.showToast("请先登录", 2, "center", "small", "error", false, true);
        return;
    }
});

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}