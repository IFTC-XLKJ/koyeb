const pluginList = document.getElementById("plugin-list");
const loadMore = document.getElementById("load-more");
const downloading = document.getElementById("downloading");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const uploadFileDialog = document.getElementById("upload-file");
const progress2 = document.getElementById("progress2");
const progressText2 = document.getElementById("progressText2");
const uploadPlugin = document.getElementById("upload-plugin");
const uploadDialog = document.getElementById("upload-dialog");
const uploadSubmit = document.getElementById("upload-submit");
const uploadCancel = document.getElementById("upload-cancel");
const opUploadSubmit = document.getElementById("op-upload-submit");
const opUploadCancel = document.getElementById("op-upload-cancel");
const pluginName = document.getElementById("plugin-name");
const pluginId = document.getElementById("plugin-id");
const pluginDescription = document.getElementById("plugin-description");
const pluginVersionCode = document.getElementById("plugin-version-code");
const pluginVersionName = document.getElementById("plugin-version-name");
const pluginFile = document.getElementById("plugin-file");
const loading = document.getElementById("loading");
const opUpload = document.getElementById("op-upload");
const opUploadDialog = document.getElementById("op-upload-dialog");
const opUploadData = document.getElementById("op-upload-data");
const reload = document.getElementById("reload");
if (!globalThis.bzyapp) reload.style.display = "none";
reload.addEventListener("click", async e => {
    location.reload();
});
uploadPlugin.addEventListener("click", e => {
    uploadDialog.open = true;
});
uploadCancel.addEventListener("click", e => {
    uploadDialog.open = false;
});
uploadSubmit.addEventListener("click", async e => {
    const name = pluginName.value.trim();
    const id = pluginId.value.trim();
    const description = pluginDescription.value.trim().replaceAll("\n", "<br>");
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
    if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(id)) {
        mdui.snackbar({
            message: "ID格式不合法",
            placement: "top"
        });
        return;
    }
    let progressValue = 0;
    progress2.value = 0;
    progressText2.innerText = `0%`;
    let totalSize = file.size;
    let uploadSize = 0;
    uploadFileDialog.open = true;
    try {
        const files = await sliceFile(file);
        console.log(files);
        const urls = [];
        for (let file of files) {
            const url = await uploadFile(file);
            urls.push(url);
        }
        progress2.value = 100;
        progressText2.innerText = `100%`;
        uploadFileDialog.open = false;
        loading.open = true;
        const r = await fetch("/api/webide_plugin/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                id: id,
                versionCode: versionCode,
                versionName: versionName,
                description: description,
                urls: urls,
            }),
        });
        const j = await r.json();
        loading.open = false;
        if (j.code === 200) {
            mdui.snackbar({
                message: j.msg,
                placement: "top",
            });
            uploadCancel.click();
        } else {
            mdui.snackbar({
                message: j.msg,
                placement: "top",
            });
            throw j.msg;
        }
    } catch (e) {
        console.error(e);
        mdui.snackbar({
            message: "提交失败：" + e,
            placement: "top"
        });
        uploadFileDialog.open = false;
    }
async function uploadFile(file) {
    let currentUploaded = 0;
    let lastUploaded = 0;
    
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file, file.name + ".bin");
        
        // 使用 fetch 替代 XMLHttpRequest
        fetch("https://cloud.hopex.top/apiv1/upfile/r2up.php", {
            method: 'POST',
            body: formData
        })
        .then(response => {
            // 处理进度的响应
            const reader = response.clone().body.getReader();
            let downloadedSize = 0;
            const contentLength = response.headers.get('Content-Length');
            const total = parseInt(contentLength, 10);
            
            // 模拟进度更新
            reader.read().then(function processText({done, value}) {
                if (done) {
                    return;
                }
                
                downloadedSize += value.length;
                currentUploaded = downloadedSize;
                uploadSize += (currentUploaded - lastUploaded);
                progressValue = uploadSize / totalSize;
                progress2.value = progressValue * 100;
                progressText2.innerText = `${Math.floor(progressValue * 100)}%`;
                lastUploaded = currentUploaded;
                
                // 继续读取
                return reader.read().then(processText);
            });
            
            // 处理响应结果
            return response.json();
        })
        .then(json => {
            if (json.code == 200 && json.url) {
                resolve(json.url);
            } else {
                reject(JSON.stringify(json));
            }
        })
        .catch(error => {
            console.error('上传出错:', error);
            reject(error.message || '上传出错');
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
        download(`${plugin.name}-${plugin.versionName}.js`, plugin.urls, plugin.name);
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
async function download(name, urls, n) {
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
        message: `开始下载，共 ${isNaN(totalSize) ? "未知" : totalSize} 字节`,
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
            console.log(event);
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
        r.onload = async function () {
            if (r.status === 200) {
                blobs[index] = r.response;
                // Check if all downloads are complete
                if (blobs.filter(b => b).length === urls.length) {
                    progressValue = 100;
                    progressText.innerText = `${Math.floor(progressValue)}%`;
                    console.log(`Overall Progress: ${Math.floor(progressValue)}%`);
                    // All downloads are complete
                    const combinedBlob = new Blob(blobs, { type: 'application/javascript' });
                    // 转为dataURL
                    if (globalThis.bzyapp) {
                        const code = await combinedBlob.text();
                        bzyapp.plugin(n, code);
                        mdui.snackbar({
                            message: "已加载插件到WebIDE",
                            placement: "top"
                        });
                    } else {
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
                    }
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
setTimeout(function () {
    loading.shadowRoot.querySelector(".body").style.overflow = "hidden";
}, 500);
loadPlugin();
(async function () {
    const userId = localStorage.getItem("ID");
    if (!userId) return end();
    const r = await fetch("/api/user/details?id=" + userId);
    const j = await r.json();
    console.log(j);
    if (j.code != 200) return end();
    const data = j.data;
    if (data.op) {
        opUpload.style.display = "block";
        opUpload.addEventListener("click", function () {
            opUploadDialog.open = true;
        });
        opUploadCancel.addEventListener("click", function () {
            opUploadDialog.open = false;
        });
        opUploadSubmit.addEventListener("click", async function () {
            const data = opUploadData.value.trim();
            if (!data) {
                mdui.snackbar({
                    message: "请输入数据",
                    placement: "top"
                });
                return;
            }
            opUploadSubmit.disabled = true;
            opUploadSubmit.loading = true;
            try {
                const json = JSON.parse(data);
                const r = await fetch("/api/webide_plugin/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(json)
                });
                const j = await r.json();
                if (j.code != 200) {
                    mdui.snackbar({
                        message: "提交失败：" + j.msg,
                        placement: "top"
                    });
                    opUploadSubmit.disabled = false;
                    opUploadSubmit.loading = false;
                    return;
                }
                mdui.snackbar({
                    message: "提交成功",
                    placement: "top"
                });
                opUploadDialog.open = false;
                opUploadSubmit.disabled = false;
                opUploadSubmit.loading = false;
            } catch (e) {
                mdui.snackbar({
                    message: "提交失败：" + e.message,
                    placement: "top"
                });
                opUploadSubmit.disabled = false;
                opUploadSubmit.loading = false;
            }
        });
        mdui.snackbar({
            message: "欢迎回来，" + data.username,
            placement: "top"
        });
    }
    function end() {
        opUpload.remove();
        opUploadDialog.remove();
    }
})();
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