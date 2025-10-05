const pluginList = document.getElementById("plugin-list");
const loadMore = document.getElementById("load-more");
const downloading = document.getElementById("downloading");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
loadMore.addEventListener("click", loadPlugin);
function addItem(plugin) {
    const mainCard = document.createElement("mdui-card");
    mainCard.style.margin = "1rem auto";
    mainCard.style.padding = "1rem";
    mainCard.style.boxSizing = "border-box";
    mainCard.style.width = "300px";
    const title = document.createElement("h2");
    title.innerText = plugin.name;
    title.style.margin = "0px";
    mainCard.appendChild(title);
    const pid = document.createElement("p");
    pid.style.color = "#999";
    pid.style.fontSize = "12px";
    pid.style.margin = "0px";
    pid.innerText = plugin.id;
    mainCard.appendChild(pid);
    const version = document.createElement("p");
    version.style.fontSize = "14px";
    version.style.margin = "0px";
    version.innerText = `${plugin.versionName}(${plugin.versionCode})`;
    mainCard.appendChild(version);
    const desc = document.createElement("div");
    desc.innerHTML = plugin.description;
    mainCard.appendChild(desc);
    const downloadBtn = document.createElement("mdui-button-icon");
    downloadBtn.icon = "cloud_download";
    downloadBtn.variant = "tonal";
    downloadBtn.addEventListener("click", e => {
        downloading.open = true;
        download(`${plugin.name}-${plugin.versionName}.zip`, plugin.urls);
    });
    mainCard.appendChild(downloadBtn);
    pluginList.appendChild(mainCard);
}
// (function () {
//     const p = downloading.shadowRoot.querySelector(".panel");
//     p.style.position = "fixed";
//     p.style.left = "50%";
//     p.style.transform = "translate(-50%)";
// })();
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
async function download(name, urls) {
    if (urls.length == 0) {
        mdui.snackbar({
            message: "没有下载链接",
            placement: "top"
        });
        return downloading.open = false;
    }
    let progressValue = 0;
    const blobs = [];
    urls.forEach((url, index) => {
    });
    d(urls[0], 0);
    function d(url, index) {
        const r = new XMLHttpRequest();
        r.open("GET", url);
        r.responseType = "blob";
        r.onprogress = function (event) {
            const percent = event.lengthComputable ? (event.loaded / event.total) : 0;
            console.log(percent);
            // Update overall progress
            progressValue += (percent * 100);
            console.log(progressValue);
            progressValue = progressValue;
            progress.value = progressValue / urls.length;
            progressText.innerText = `${Math.floor(progressValue / urls.length)}%`;
            console.log(`Overall Progress: ${Math.floor(progressValue / urls.length)}%`);
        };
        r.onload = function () {
            if (r.status === 200) {
                blobs[index] = r.response;
                // Check if all downloads are complete
                if (blobs.filter(b => b).length === urls.length) {
                    progressValue = 100;
                    progressText.innerText = `${Math.floor(progressValue)}%`;
                    console.log(`Overall Progress: ${Math.floor(progressValue)}%`);
                    // All downloads are complete
                    const combinedBlob = new Blob(blobs, { type: 'application/zip' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(combinedBlob);
                    link.download = name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                    mdui.snackbar({
                        message: "下载完成",
                        placement: "top"
                    });
                    downloading.open = false;
                } else {
                    d(urls[index + 1], index + 1);
                }
            } else {
                mdui.snackbar({
                    message: `下载失败，状态码：${r.status}`,
                    placement: "top"
                });
                downloading.open = false;
            }
        };
        r.onerror = function () {
            mdui.snackbar({
                message: "下载时发生错误",
                placement: "top"
            });
            downloading.open = false;
        };
        r.send();
    }
}
loadPlugin();