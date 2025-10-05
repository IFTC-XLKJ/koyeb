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
        if (json.code != 200) return pluginGetPage--;
    } catch (e) {
        pluginGetPage--;
    }
}