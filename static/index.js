const banners = [
    {
        title: "广告位招租",
        content: "广告位招租(5元/月)，欢迎联系我(QQ:3164417130,邮箱:iftcceo@139.com)",
        img: "/static/广告位招租.png",
        url: "mailto:iftcceo@139.com?subject=广告位招租申请&body=标题: 内容: 图片: 链接:     说明:图片宽高比必须为16:9"
    },
    {
        title: "广告位招租",
        content: "广告位招租(5元/月)，欢迎联系我(QQ:3164417130,邮箱:iftcceo@139.com)",
        img: "/static/广告位招租.png",
        url: "mailto:iftcceo@139.com?subject=广告位招租申请&body=标题: 内容: 图片: 链接:     说明:图片宽高比必须为16:9"
    },
    {
        title: "广告位招租",
        content: "广告位招租(5元/月)，欢迎联系我(QQ:3164417130,邮箱:iftcceo@139.com)",
        img: "/static/广告位招租.png",
        url: "mailto:iftcceo@139.com?subject=广告位招租申请&body=标题: 内容: 图片: 链接:     说明:图片宽高比必须为16:9"
    },
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
    const banner = document.getElementById("bannerMain")
    banners.forEach((BANNER, i) => {
        const bannerDiv = document.createElement("img");
        bannerDiv.className = "banner";
        bannerDiv.src = BANNER.img;
        bannerDiv.alt = BANNER.title;
        if (i == 0) {
            bannerDiv.setAttribute("iftc-current", true)
        }
        bannerDiv.addEventListener("click", e => {
            e.preventDefault();
            open(BANNER.url, "_blank");
        })
        bannerDiv.setAttribute("iftc-index", i)
        banner.appendChild(bannerDiv);
    });
    setInterval(() => {
        const banneres = document.querySelectorAll(".banner");
        banneres.forEach((banner, i) => {
            const isCurrent = banner.getAttribute("iftc-current");
            const index = banner.getAttribute("iftc-index");
            if (isCurrent) {
                banner.removeAttribute("iftc-current");
                if (i < banneres.length - 1) {
                    banneres[i + 1].setAttribute("iftc-current", true);
                } else {
                    banneres[0].setAttribute("iftc-current", true);
                }
                document.querySelector("[iftc-current=true]").scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        })
    }, 5000)
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