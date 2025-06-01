const userId = localStorage.getItem("ID");
const password = localStorage.getItem("password");
const toast = new Toast();
if (!userId) location.href = "/login";
if (parserUrlParams().id != userId) location.href = `/user?id=${userId}`;
if (!parserUrlParams().id) location.href = `/user?id=${userId}`;

const updateAvatar = document.getElementById("update-avatar");
updateAvatar.addEventListener("click", e => {
    const fileSelector = document.createElement("input");
    fileSelector.type = "file";
    fileSelector.accept = ".jpg,.jpeg,.png,.gif,.webp,.svg";
    fileSelector.addEventListener("change", async e => {
        const loadid = toast.loading("上传中...");
        const file = e.target.files[0];
        if (file.size > 1024 * 1024 * 25) return alert("文件大小不能超过25MB");
        if (file) {
            const formData = new FormData();
            formData.append("file", file, "avatar.png");
            formData.append("path", "vv/avatar");
            const requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            }; try {
                const response = await fetch("https://api.pgaot.com/user/up_cat_file", requestOptions);
                const data = await response.json();
                if (data.code != 200) {
                    toast.hideToast(loadid);
                    toast.showTaost("上传头像失败，原因：" + data.msg, 2000, "center", "large", "error", "", false);
                } else {
                    const avatarUrl = data.url;
                    const response2 = await fetch(`/api/user/update?type=avatar&id=${userId}&password=${encodeURIComponent(password)}&data=${encodeURIComponent(avatarUrl)}`);
                    const data2 = await response2.json();
                    if (data2.code == 200) {
                        toast.hideToast(loadid);
                        toast.showTaost("上传头像成功", 2000, "center", "large", "success", "", false);
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    } else {
                        toast.hideToast(loadid);
                        toast.showTaost("上传头像失败，原因：" + data2.msg, 2000, "center", "large", "error", "", false);
                    }
                }
            } catch (e) {
                toast.hideToast(loadid);
                toast.showTaost("上传头像失败，原因：" + e, 2000, "center", "large", "error", "", false);
            }
        }
    });
    fileSelector.click();
});

function parserUrlParams() {
    const params = new URLSearchParams(location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}