
if (localStorage.getItem("ID") && localStorage.getItem("password")) {
    const url = new URL(location.href);
    const page = url.searchParams.get("page") || "/";
    location.href = page;
}