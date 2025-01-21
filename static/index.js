const banners = [
    {
        "title": "",
        "content": "",
        "img": ""
    }
]
addEventListener("load", e => {
    console.log("加载完成")
    const navItems = document.querySelectorAll(".nav-item")
    navItems.forEach(navItem => {
        console.log(navItem)
        navItem.addEventListener("click", e => {
            location.href = navItem.getAttribute("iftc-page")
        })
    })
})