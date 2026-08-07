const toast = new Toast();

async function init() {
    const idCookie = await cookieStore.get("ID");
    const userId = idCookie?.value;
    console.log("userId", userId);
    if (!userId) {
        location.href = "/login?page=" + encodeURIComponent("/user");
        return;
    }

    const params = parserUrlParams();
    console.log("params", params);
    // if (params.id && params.id !== userId) {
    //     location.href = `/user?id=${userId}`;
    //     return;
    // }

    const tokenDisplay = document.getElementById("token-display");
    const copyTokenBtn = document.getElementById("copy-token");
    let tokenRetryCount = 0;
    const maxTokenRetries = 5;
    const tokenRetryIntervals = [3000, 5000, 10000, 15000, 30000];

    const password = localStorage.getItem("password");
    if (!password) {
        location.href = "/login?page=" + encodeURIComponent("/user");
        return;
    }

    async function fetchToken() {
        try {
            const response = await fetch(`/api/user/gettoken?id=${userId}&password=${encodeURIComponent(password)}`, {
                headers: { "Cache-Control": "no-cache" }
            });
            const data = await response.json();
            if (data.code == 200) {
                tokenDisplay.textContent = data?.token || "获取失败";
                cookieStore.set("token", data?.token || "");
                tokenRetryCount = 0;
            } else {
                tokenDisplay.textContent = "获取失败";
                scheduleTokenRetry();
            }
        } catch (e) {
            tokenDisplay.textContent = "获取失败";
            scheduleTokenRetry();
        }
    }

    function scheduleTokenRetry() {
        if (tokenRetryCount < maxTokenRetries) {
            const delay = tokenRetryIntervals[tokenRetryCount];
            tokenRetryCount++;
            setTimeout(fetchToken, delay);
        }
    }

    fetchToken();

    copyTokenBtn.addEventListener("click", () => {
        const token = tokenDisplay.textContent;
        if (token && token !== "加载中..." && token !== "获取失败") {
            navigator.clipboard.writeText(token).then(() => {
                toast.showToast("Token 已复制", 2, "center", "large", "success", "", false);
            }).catch(() => {
                toast.showToast("复制失败", 2, "center", "large", "error", "", true);
            });
        }
    });

    const signIn = document.getElementById("sign-in");
    signIn.addEventListener("click", async () => {
        const loadid = toast.loading("签到中...");
        try {
            const tokenCookie = await cookieStore.get("token");
            const tokenValue = tokenCookie?.value;
            if (!tokenValue) {
                toast.hideToast(loadid);
                toast.showToast("签到失败，原因：Token不存在", 2, "center", "large", "error", "", true);
                return;
            }
            const response = await fetch(`/api/sign?token=${encodeURIComponent(tokenValue)}`);
            const data = await response.json();
            toast.hideToast(loadid);
            if (data.code == 200) {
                toast.showToast("签到成功！", 2, "center", "large", "success", "", false);
                setTimeout(() => location.reload(), 2000);
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

        // Fetch a fresh token for the update request
        const tokenLoadid = toast.loading("获取Token中...");
        let token = "";
        try {
            const response = await fetch(`/api/user/gettoken?id=${userId}&password=${encodeURIComponent(password)}`, {
                headers: { "Cache-Control": "no-cache" }
            });
            const data = await response.json();
            if (data.code == 200) token = data?.token || "";
        } catch (e) { }
        toast.hideToast(tokenLoadid);

        if (!token) {
            toast.showToast("获取Token失败，请重试", 2, "center", "large", "error", "", true);
            return;
        }

        // Build dialog view
        const view = document.createElement("div");
        view.className = "username-dialog";

        const headline = document.createElement("h2");
        headline.className = "username-dialog-headline";
        headline.textContent = "修改用户名";
        view.appendChild(headline);

        const desc = document.createElement("p");
        desc.className = "username-dialog-desc";
        desc.textContent = "请输入新的用户名，不能包含空格和 # 字符";
        view.appendChild(desc);

        const input = document.createElement("s-text-field");
        input.setAttribute("label", "用户名");
        input.setAttribute("value", username);
        input.setAttribute("maxLength", "20");
        input.setAttribute("countered", "");
        input.style.width = "100%";
        view.appendChild(input);

        const error = document.createElement("p");
        error.className = "username-dialog-error";
        error.style.display = "none";
        view.appendChild(error);

        const actions = document.createElement("div");
        actions.className = "username-dialog-actions";

        const cancelBtn = document.createElement("s-button");
        cancelBtn.setAttribute("type", "text");
        cancelBtn.textContent = "取消";
        actions.appendChild(cancelBtn);

        const confirmBtn = document.createElement("s-button");
        confirmBtn.setAttribute("type", "filled");
        confirmBtn.textContent = "确定";
        actions.appendChild(confirmBtn);

        view.appendChild(actions);

        const dialog = sober.Dialog.builder({
            view: view,
            disabledGesture: true
        });

        const showError = (msg) => {
            error.textContent = msg;
            error.style.display = "block";
            input.error = true;
        };

        const clearError = () => {
            error.style.display = "none";
            input.error = false;
        };

        input.addEventListener("input", clearError);
        dialog.addEventListener("showed", () => input.native?.focus());

        cancelBtn.addEventListener("click", () => {
            dialog.showed = false;
            setTimeout(() => dialog.close(), 300);
        });

        confirmBtn.addEventListener("click", async () => {
            const newUsername = input.value?.trim();
            if (!newUsername) return showError("用户名不能为空");
            if (newUsername.includes("#")) return showError("用户名不能包含 # 字符");
            if (newUsername.includes(" ")) return showError("用户名不能包含空格字符");
            if (newUsername === username) return showError("新用户名与当前用户名相同");

            confirmBtn.disabled = true;
            const loadid = toast.loading("修改中...");
            try {
                const response = await fetch(`/api/user/update-username?token=${encodeURIComponent(token)}&username=${encodeURIComponent(newUsername)}`);
                const data = await response.json();
                toast.hideToast(loadid);
                if (data.code == 200) {
                    dialog.close();
                    toast.showToast("用户名更新成功", 2, "center", "large", "success", "", false);
                    setTimeout(() => location.reload(), 2000);
                } else {
                    confirmBtn.disabled = false;
                    showError(data.msg || "修改失败，请重试");
                }
            } catch (e) {
                toast.hideToast(loadid);
                confirmBtn.disabled = false;
                showError("网络错误：" + e);
            }
        });
    });

    const updateAvatar = document.getElementById("update-avatar");
    updateAvatar.addEventListener("click", e => {
        const fileSelector = document.createElement("input");
        fileSelector.type = "file";
        fileSelector.accept = ".jpg,.jpeg,.png,.gif,.webp,.bmp";
        fileSelector.addEventListener("change", async e => {
            const loadid = toast.loading("上传中...");
            const file = e.target.files[0];
            if (!file) {
                toast.hideToast(loadid);
                return;
            }
            if (file.size > 1024 * 1024 * 5) {
                toast.hideToast(loadid);
                toast.showToast("上传头像失败，原因：头像大小不能超过5MB", 2, "center", "large", "error", "", true);
                return;
            }
            if (!file.type.startsWith("image/") && !file.name.endsWith(".bin")) {
                toast.hideToast(loadid);
                toast.showToast("上传头像失败，原因：上传的文件不是图片", 2, "center", "large", "error", "", true);
                return;
            }
            try {
                const formData = new FormData();
                formData.append("avatar", file);
                const r = await fetch("/api/upload-avatar", {
                    method: "POST",
                    body: formData,
                });
                if (!r.ok) {
                    const errorData = await r.json().catch(() => null);
                    toast.hideToast(loadid);
                    toast.showToast("上传头像失败，原因：" + (errorData?.msg || r.statusText), 2, "center", "large", "error", "", true);
                    return;
                }
                const data = await r.json();
                if (data.error) {
                    toast.hideToast(loadid);
                    toast.showToast("上传头像失败，原因：" + data.error, 2, "center", "large", "error", "", true);
                    return;
                }
                const avatarUrl = "https://dbmp-xbgmorqeur6oh81z.database.nocode.cn/storage/v1/object/public/avatar/" + data.data.path;

                // Fetch a fresh token for the update request
                let token = "";
                try {
                    const tokenResponse = await fetch(`/api/user/gettoken?id=${userId}&password=${encodeURIComponent(password)}`, {
                        headers: { "Cache-Control": "no-cache" }
                    });
                    const tokenData = await tokenResponse.json();
                    if (tokenData.code == 200) token = tokenData?.token || "";
                } catch (e) { }
                if (!token) {
                    toast.hideToast(loadid);
                    toast.showToast("获取Token失败，请重试", 2, "center", "large", "error", "", true);
                    return;
                }

                const response2 = await fetch(`/api/user/update-avatar?token=${encodeURIComponent(token)}&avatar=${encodeURIComponent(avatarUrl)}`);
                const data2 = await response2.json();
                if (data2.code == 200) {
                    toast.hideToast(loadid);
                    toast.showToast("上传头像成功", 2, "center", "large", "success", "", false);
                    setTimeout(() => location.reload(), 2000);
                } else {
                    toast.hideToast(loadid);
                    toast.showToast("上传头像失败，原因：" + data2.msg, 2, "center", "large", "error", "", true);
                }
            } catch (e) {
                toast.hideToast(loadid);
                toast.showToast("上传头像失败，原因：" + e, 2, "center", "large", "error", "", true);
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
        cookieStore.delete("ID");
        location.href = "/login?page=" + encodeURIComponent("/user");
    });

    const redeemButton = document.getElementById("redeem-button");
    const redeemCodeField = document.getElementById("redeem-code");

    redeemButton.addEventListener("click", async () => {
        const code = redeemCodeField.value?.trim();
        if (!code) {
            toast.showToast("请输入兑换码", 2, "center", "large", "error", "", true);
            return;
        }

        const codeRegex = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;
        if (!codeRegex.test(code)) {
            toast.showToast("兑换码格式错误，应为XXXX-XXXX-XXXX-XXXX", 2, "center", "large", "error", "", true);
            return;
        }

        const loadid = toast.loading("兑换中...");
        try {
            const response = await fetch(`/api/redeemvc?code=${encodeURIComponent(code)}&id=${encodeURIComponent(userId)}`);
            const data = await response.json();
            toast.hideToast(loadid);
            if (data.code == 200) {
                toast.showToast(`兑换成功！获得 ${data.added} V币`, 2, "center", "large", "success", "", false);
                setTimeout(() => location.reload(), 2000);
            } else {
                toast.showToast("兑换失败，原因：" + data.msg, 2, "center", "large", "error", "", true);
            }
        } catch (e) {
            toast.hideToast(loadid);
            toast.showToast("兑换失败，原因：" + e, 2, "center", "large", "error", "", true);
        }
    });
}

function parserUrlParams() {
    const params = new URLSearchParams(location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}

init();