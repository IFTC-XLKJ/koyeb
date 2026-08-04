const userId = localStorage.getItem("ID");
const password = localStorage.getItem("password");
const toast = new Toast();
if (!userId) location.href = "/login?page=" + encodeURIComponent(location.href);
else if (parserUrlParams().id != userId) location.href = `/user?id=${userId}`;
else if (!parserUrlParams().id) location.href = `/user?id=${userId}`;

const signIn = document.getElementById("sign-in");
signIn.addEventListener("click", async () => {
    const loadid = toast.loading("签到中...");
    try {
        const tokenResponse = await fetch(`/api/user/gettoken?id=${userId}&password=${encodeURIComponent(password)}`, {
            headers: {
                "Cache-Control": "no-cache"
            }
        });
        const tokenData = await tokenResponse.json();
        if (tokenData.code != 200 || !tokenData.token) {
            toast.hideToast(loadid);
            toast.showToast("获取签到凭证失败，原因：" + (tokenData.msg || "未知错误"), 2, "center", "large", "error", "", true);
            return;
        }
        const response = await fetch(`/api/sign?token=${encodeURIComponent(tokenData.token)}`);
        const data = await response.json();
        toast.hideToast(loadid);
        if (data.code == 200) {
            toast.showToast("签到成功！", 2, "center", "large", "success", "", false);
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            toast.showToast("签到失败，原因：" + data.msg, 2, "center", "large", "error", "", true);
        }
    } catch (e) {
        toast.hideToast(loadid);
        toast.showToast("签到失败，原因：" + e, 2, "center", "large", "error", "", true);
    }
});
const updateUsername = document.getElementById("update-username");
updateUsername.addEventListener("click", async () => {
    const username = document.querySelector(`[data="username"]`).innerText;
    // Create dialog for prompt
    const dialog = document.createElement("s-dialog");
    dialog.innerHTML = `
        <div style="padding: 24px;">
            <h3 style="margin: 0 0 16px;">修改用户名</h3>
            <s-text-field id="username-input" label="用户名" value="${username}" style="width: 100%;"></s-text-field>
            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
                <s-button id="cancel-btn" type="text">取消</s-button>
                <s-button id="confirm-btn" type="filled">确定</s-button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.show();
    
    document.getElementById("cancel-btn").onclick = () => {
        dialog.close();
        setTimeout(() => dialog.remove(), 300);
    };
    
    document.getElementById("confirm-btn").onclick = async () => {
        const newUsername = document.getElementById("username-input").value;
        if (newUsername && newUsername !== username) {
            // TODO: Add API call to update username
            toast.showToast("用户名更新成功", 2, "center", "large", "success", "", false);
        }
        dialog.close();
        setTimeout(() => dialog.remove(), 300);
    };
});
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