const { isTypePredicateNode } = require("typescript");

const userId = localStorage.getItem("ID");
if (!userId) location.href = "/login";
if (parserUrlParams().id != userId) location.href = `/user?id=${userId}`;
if (!parserUrlParams().id) location.href = `/user?id=${userId}`;

const updateAvatar = document.getElementById("update-avatar");
updateAvatar.addEventListener("click", e => {
    const fileSelector = document.createElement("input");
    fileSelector.type = "file";
    fileSelector.accept = ".jpg,.jpeg,.png,.gif,.webp,.svg";
    fileSelector.addEventListener("change", async e => {
        const file = e.target.files[0];
        if (file.size > 1024 * 1024 * 25) return alert("文件大小不能超过25MB");
        if (file) {
            const formData = new FormData();
            formData.append("file", file, "avatar.png");
            formData.append("path", "vv/avatar");
            const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            }; try {
                const response = await fetch("https://api.pgaot.com/user/up_cat_file", requestOptions);
                const data = await response.json();
            } catch (e) {
                alert("上传头像失败，原因：" + e);
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