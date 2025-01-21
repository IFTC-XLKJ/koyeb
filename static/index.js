const banners = [
    {
        title: "广告位招租",
        content: "广告位招租(5元/月)，欢迎联系我(QQ:3164417130,邮箱:iftcceo@139.com)",
        img: "",
        url: "mailto:iftcceo@139.com?subject=广告位招租申请&body=标题:\r\n内容:\r\n图片:\r\n链接:"
    }
]
addEventListener("load", e => {
    console.log("加载完成")
    setBanner()
    const navItems = document.querySelectorAll(".nav-item")
    navItems.forEach(navItem => {
        console.log(navItem)
        navItem.addEventListener("click", e => {
            location.href = navItem.getAttribute("iftc-page")
        })
    })
})

function setBanner() {
    const banner = document.getElementById("banner")
    banners.forEach(BANNER => {
        const bannerItem = document.createElement("div")
        bannerItem.classList.add("banner-item")
        bannerItem.innerHTML = `<img src="${BANNER.img}" alt="${BANNER.title}" title="${BANNER.content}">`
        bannerItem.addEventListener("click", e => {
            open(BANNER.url, "_blank")
        })
        banner.appendChild(bannerItem)
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

onerror = function (msg, url, line, col, error) {
    console.error("Error: " + msg + "\nURL: " + url + "\nLine: " + line + "\nColumn: " + col + "\nError object: " + JSON.stringify(error));
}