const pluginList = document.getElementById("plugin-list");
const loadMore = document.getElementById("load-more");
loadMore.addEventListener("click", loadPlugin);
function addItem(plugin) {
    const mainCard = document.createElement("mdui-card");
    mainCard.style.margin = "1rem auto";
    mainCard.style.padding = "1rem";
    mainCard.style.boxSizing = "border-box";
    const title = document.createElement("h2");
    title.innerText = plugin.name;
    title.style.margin = "0px";
    mainCard.appendChild(title);
    const pid = document.createElement("p");
    pid.style.color = "#999";
    pid.style.fontSize = "12px";
    pid.innerText = plugin.id;
    mainCard.appendChild(pid);
    const version = document.createElement("p");
    version.innerText = `${plugin.versionName}(${plugin.versionCode})`;
    mainCard.appendChild(version);
    const desc = document.createElement("div");
    desc.innerHTML = plugin.description;
    mainCard.appendChild(desc);
    pluginList.appendChild(mainCard);
}
globalThis.pluginGetPage = 0;
async function loadPlugin() {
    pluginGetPage++;
    try {
        loadMore.disabled = true;
        loadMore.loading = true;
        loadMore.innerText = "加载中...";
        const res = await fetch(`/api/webide_plugin/get?page=${pluginGetPage}`);
        const json = await res.json();
        if (json.code != 200) {
            mdui.snackbar({
                message: "加载失败，错误信息：(" + json.code + ")" + json.msg + "，请稍后再试",
                placement: "top"
            });
            loadMore.disabled = false;
            loadMore.loading = false;
            loadMore.innerText = "加载更多";
            return pluginGetPage--;
        }
        const data = json.data;
        if (data.length == 0) {
            mdui.snackbar({
                message: "没有更多插件了",
                placement: "top"
            });
            loadMore.disabled = false;
            loadMore.loading = false;
            loadMore.innerText = "加载更多";
            return pluginGetPage--;
        }
        data.forEach(plugin => {
            addItem(plugin);
        });
        mdui.snackbar({
            message: "加载成功",
            placement: "top"
        });
        loadMore.disabled = false;
        loadMore.loading = false;
        loadMore.innerText = "加载更多";
    } catch (e) {
        console.error(e);
        pluginGetPage--;
        loadMore.disabled = false;
        loadMore.loading = false;
        loadMore.innerText = "加载更多";
        mdui.snackbar({
            message: "加载失败，请检查网络连接",
            placement: "top"
        });
    }
}
loadPlugin();