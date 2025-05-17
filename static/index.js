console.log("加载完成")

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