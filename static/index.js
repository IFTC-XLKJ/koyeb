const banners = [
    {
        title: "广告位招租",
        content: "广告位招租(5元/月)，欢迎联系我(QQ:3164417130,邮箱:iftcceo@139.com)",
        img: "",
        url: "mailto:iftcceo@139.com"
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

function setBanner() {
    banners.forEach(banner => {
        const bannerItem = document.createElement("div")
        bannerItem.classList.add("banner-item")
    })
}

// API测试请求
(async function () {
    const response = await fetch("https://iftc.koyeb.app/api")
    if (response.ok) {
        const data = await response.json()
        console.log("API测试请求成功", data)
    } else {
        console.error("API测试请求失败")
    }
})()