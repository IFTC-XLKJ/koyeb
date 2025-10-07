const pluginList = document.getElementById("plugin-list");
const loadMore = document.getElementById("load-more");
const downloading = document.getElementById("downloading");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const progress2 = document.getElementById("progress2");
const progressText2 = document.getElementById("progressText2");
const uploadPlugin = document.getElementById("upload-plugin");
const uploadDialog = document.getElementById("upload-dialog");
const uploadSubmit = document.getElementById("upload-submit");
const uploadCancel = document.getElementById("upload-cancel");
const pluginName = document.getElementById("plugin-name");
const pluginId = document.getElementById("plugin-id");
const pluginDescription = document.getElementById("plugin-description");
const pluginVersionCode = document.getElementById("plugin-version-code");
const pluginVersionName = document.getElementById("plugin-version-name");
const pluginFile = document.getElementById("plugin-file");
uploadPlugin.addEventListener("click", e => {
    uploadDialog.open = true;
});
uploadCancel.addEventListener("click", e => {
    uploadDialog.open = false;
});
uploadSubmit.addEventListener("click", async e => {
    const name = pluginName.value.trim();
    const id = pluginId.value.trim();
    const description = pluginDescription.value.trim();
    const versionCode = pluginVersionCode.value.trim();
    const versionName = pluginVersionName.value.trim();
    const file = pluginFile.shadowRoot.querySelector("input").files[0];
    if (!name || !id || !description || !versionCode || !versionName || !file) {
        mdui.snackbar({
            message: "请填写完整信息",
            placement: "top"
        });
        return;
    }
    if (file.name.split(".").pop() != "js") {
        mdui.snackbar({
            message: "请选择一个js文件",
            placement: "top"
        });
        return;
    }
    let progressValue = 0;
    progress2.value = 0;
    progressText2.innerText = `0%`;
    let totalSize = file.size;
    let uploadSize = 0;
    try {
        const files = await sliceFile(file);
        console.log(files);
        for (let file of files) {
            const url = await uploadFile(file);
            urls.push(url);
        }
        const urls = [];
        const r = await fetch("/api/webide_plugin/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
            }),
        });
    } catch (e) {
        mdui.snackbar({
            message: "提交失败：" + e,
            placement: "top"
        });
    }
    async function uploadFile(file) {
        let currentUploaded = 0;
        let lastUploaded = 0;
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', function (event) {
                if (!event.lengthComputable) return;
                currentUploaded = event.loaded;
                uploadSize += (currentUploaded - lastUploaded);
                console.log(`Uploaded ${uploadSize} of ${totalSize} bytes`);
            });
        });
    }
});
loadMore.addEventListener("click", loadPlugin);
function addItem(plugin) {
    const mainCard = document.createElement("mdui-card");
    mainCard.style.margin = "1rem";
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
        download(`${plugin.name}-${plugin.versionName}.js`, plugin.urls);
    });
    mainCard.appendChild(downloadBtn);
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
async function download(name, urls) {
    if (!urls || urls.length == 0) {
        mdui.snackbar({
            message: "没有下载链接",
            placement: "top"
        });
        return downloading.open = false;
    }
    progress.value = 0;
    let progressValue = 0;
    const blobs = [];
    mdui.snackbar({
        message: "等待获取文件大小...",
        placement: "top"
    });
    let totalSize = 0;
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const index = i;
        // 获取每个文件的大小
        const r = await fetch(url, { method: "HEAD" });
        const size = r.headers.get("Content-Length");
        totalSize += parseInt(size);
        console.log(`File ${index + 1} size: ${size} bytes`);
    }
    mdui.snackbar({
        message: `开始下载，共 ${totalSize} 字节`,
        placement: "top"
    });
    d(urls[0], 0);
    let downloadedSize = 0;
    function d(url, index) {
        let currentDownloaded = 0;
        const r = new XMLHttpRequest();
        r.open("GET", url);
        r.responseType = "blob";
        let lastDownloaded = 0;
        r.onprogress = function (event) {
            if (!event.lengthComputable) return;
            currentDownloaded = event.loaded;
            downloadedSize += (currentDownloaded - lastDownloaded);
            console.log(`Downloaded ${downloadedSize} of ${totalSize} bytes`);
            // Update overall progress
            progressValue = downloadedSize / totalSize * 100;
            console.log(progressValue);
            progress.value = progressValue;
            progressText.innerText = `${Math.floor(progressValue)}%`;
            console.log(`Overall Progress: ${Math.floor(progressValue)}%`);
            lastDownloaded = currentDownloaded;
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
                    // 转为dataURL
                    const url = URL.createObjectURL(combinedBlob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
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

/**
 * 文件切片
 * @param {File} file 
 */
function sliceFile(file) {
    return new Promise((resolve, reject) => {
        const chunkSize = 1024 * 1024 * 1;
        if (file.size <= chunkSize) {
            resolve([file]);
            return;
        }
        const numChunks = Math.ceil(file.size / chunkSize);
        const chunksPerWorker = Math.ceil(numChunks / 4);
        const slices = [];
        let workerEnd = 0;
        for (let i = 0; i < 4; i++) {
            const worker = new Worker('/static/fileSlice.js');
            const startChunk = i * chunksPerWorker;
            const endChunk = Math.min(startChunk + chunksPerWorker, numChunks);
            worker.postMessage({
                file: file,
                chunkSize: chunkSize,
                startChunk: startChunk,
                endChunk: endChunk,
                totalSize: file.size
            });
            worker.onmessage = function (e) {
                const { chunks } = e.data;
                slices.push(...chunks);
                console.log(`Received ${chunks.length} chunks from worker`);
                workerEnd++;
                if (workerEnd === 4) {
                    console.log('All workers completed');
                    resolve(slices);
                }
            };
            worker.onerror = function (error) {
                console.error('Error in worker:', error);
                reject(error);
            };
        }
    })
}