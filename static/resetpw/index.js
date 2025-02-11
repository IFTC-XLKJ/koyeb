const resetpwForm = document.getElementById("resetpwForm");
const user = document.getElementById("user");
const password = document.getElementById("password");

if (localStorage.getItem("ID") && localStorage.getItem("password")) {
    const url = new URL(location.href);
    const page = url.searchParams.get("page") || "/";
    location.href = page;
}