const pluginList = document.getElementById("plugin-list");
const loadMore = document.getElementById("load-more");
function addItem(plugin) {
    const mainCard = document.createElement("mdui-card");
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
    } catch (e) {
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