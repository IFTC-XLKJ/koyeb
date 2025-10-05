const pluginList = document.getElementById("plugin-list");
function addItem() {
    const mainCard = document.createElement("mdui-card");
    pluginList.appendChild(mainCard);
}
globalThis.pluginGetPage = 0;
async function loadPlugin() {
    pluginGetPage++;
    try {
        const res = await fetch(`/api/webide_plugin/get?page=${pluginGetPage}`);
        const json = await res.json();
        if (json.code != 200) {
            mdui.snackbar({
                message: "加载失败，错误信息：(" + json.code + ")" + json.msg + "，请稍后再试",
                placement: "top"
            });
            return pluginGetPage--;
        }
        const data = json.data;
        if (data.length == 0) {
            mdui.snackbar({
                message: "没有更多插件了",
                placement: "top"
            });
            return pluginGetPage--;
        }
    } catch (e) {
        pluginGetPage--;
        mdui.snackbar({
            message: "加载失败，请检查网络连接",
            placement: "top"
        });
    }
}