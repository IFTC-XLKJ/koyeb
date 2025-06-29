const userId = localStorage.getItem("ID");
const password = localStorage.getItem("password");
const toast = new Toast();
// const dialog = new Dialog({
//     id: "dialog",
//     useMD3: true,
// });
if (!userId) location.href = "/login?page=" + encodeURIComponent(location.href);
else if (parserUrlParams().id != userId) location.href = `/user?id=${userId}`;
else if (!parserUrlParams().id) location.href = `/user?id=${userId}`;
const { prompt } = mdui;

const updateUsername = document.getElementById("update-username");
updateUsername.addEventListener("click", async () => {
    const username = document.querySelector(`[data="username"]`).innerText;
    // dialog.showInputDialog("修改用户名", "", "", "", username, "确定", "left", "update-username");
    prompt({
        headline: "修改用户名",
        description: "",
        closeOnEsc: true,
        closeOnOutsideClick: true,
        confirmText: "确定",
        cancelText: "取消",
        textFieldOptions: {
            label: "用户名",
            value: username,
            type: "text",
            required: true,
            helperText: "请输入新的用户名",
            // validationMessage: "用户名不能为空",
        }
    })
    document.querySelectorAll("mdui-button[variant='text']").forEach(button => {
        button.setAttribute("variant", "filled");
    });
});
// dialog.on("onInputFinish", async (value, dialogId) => {
//     console.log("onInputFinish", value, dialogId);
//     if (dialogId == "update-username") {
//         if (value.trim() == "") {
//             toast.showToast("用户名不能为空", 2, "center", "large", "error", "", true);
//             return;
//         }
//         const loadid = toast.loading("修改用户名中...");
//         try {
//             const response = await fetch(`/api/user/update?type=nickname&id=${userId}&password=${encodeURIComponent(password)}&data=${encodeURIComponent(value)}`);
//             const data = await response.json();
//             if (data.code == 200) {
//                 toast.hideToast(loadid);
//                 toast.showToast("修改用户名成功", 2, "center", "large", "success", "", false);
//                 setTimeout(() => {
//                     location.reload();
//                 }, 2000);
//             } else {
//                 toast.hideToast(loadid);
//                 toast.showToast("修改用户名失败，原因：" + data.msg, 2, "center", "large", "error", "", true);
//             }
//         } catch (e) {
//             toast.hideToast(loadid);
//             toast.showToast("修改用户名失败，原因：" + e, 2, "center", "large", "error", "", true);
//             return;
//         }
//     }
// });
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
            };
            try {
                const response = await fetch("https://api.pgaot.com/user/up_cat_file", requestOptions);
                const data = await response.json();
                if (data.code != 200) {
                    toast.hideToast(loadid);
                    toast.showToast("上传头像失败，原因：" + data.msg, 2, "center", "large", "error", "", true);
                } else {
                    const avatarUrl = data.url;
                    const response2 = await fetch(`/api/user/update?type=avatar&id=${userId}&password=${encodeURIComponent(password)}&data=${encodeURIComponent(avatarUrl)}`);
                    const data2 = await response2.json();
                    if (data2.code == 200) {
                        toast.hideToast(loadid);
                        toast.showToast("上传头像成功", 2, "center", "large", "success", "", false);
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    } else {
                        toast.hideToast(loadid);
                        toast.showToast("上传头像失败，原因：" + data2.msg, 2, "center", "large", "error", "", true);
                    }
                }
            } catch (e) {
                toast.hideToast(loadid);
                toast.showToast("上传头像失败，原因：" + e, 2, "center", "large", "error", "", true);
            }
        }
    });
    fileSelector.click();
});
const changePassword = document.getElementById("change-password");
changePassword.addEventListener("click", async () => {
    location.href = "/resetpw";
});
const logout = document.getElementById("logout");
logout.addEventListener("click", async () => {
    localStorage.removeItem("ID");
    localStorage.removeItem("password");
});

function parserUrlParams() {
    const params = new URLSearchParams(location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}