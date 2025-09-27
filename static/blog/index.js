menu.addEventListener("click", function () {
    if (drawer.open) drawer.open = false;
    else drawer.open = true;
});
addEventListener("scroll", e => {
    document.querySelector("mdui-top-app-bar").style.top = document.querySelector("html").scrollTop + "px";
});