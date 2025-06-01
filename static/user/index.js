const userId = localStorage.getItem("ID");
if (!userId) location.href = "/login";
if (!parserUrlParams().id) location.href = `/user?id=${userId}`;

function parserUrlParams() {
    const params = new URLSearchParams(location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}