const userId = localStorage.getItem("ID");
if (!userId) location.href = "/login";
if (parserUrlParams().id != userId) location.href = `/user?id=${userId}`;
if (!parserUrlParams().id) location.href = `/user?id=${userId}`;

const updateAvatar = document.getElementById("update-avatar");
updateAvatar.addEventListener("click", e => {
    const file = document.createElement("input");
    file.type = "file";
    file.accept = ".jpg,.jpeg,.png,.gif,.webp,.svg";
    file.addEventListener("change", e => {
    });
    file.click();
});

function parserUrlParams() {
    const params = new URLSearchParams(location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}