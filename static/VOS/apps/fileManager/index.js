globalThis.isCtrl = false;
globalThis.isShift = false;
addEventListener("keydown", e => {
    if (e.key === "Escape") {
        API.postMessage({ type: "close" });
    }
    if (e.key === "Control") {
        globalThis.isCtrl = true;
    }
    if (e.key === "Shift") {
        globalThis.isShift = true;
    }
});
addEventListener("keyup", e => {
    if (e.key === "Control") {
        globalThis.isCtrl = false;
    }
    if (e.key === "Shift") {
        globalThis.isShift = false;
    }
});

addEventListener("load", async e => {
    console.log("fileManager DOMContentLoaded");
    const pathSpan = document.querySelector("#path span");
    const pathInput = document.querySelector("#path input");
    const dialog = new API.Dialog({
        id: "fileManager"
    });
    try {
        API.postMessage({ type: "setDrag" });
        newTab("Home", "/storage/share/");
        document.querySelector(".tab").classList.add("active");
        pathSpan.textContent = "/storage/share/";
        pathInput.value = pathSpan.textContent;
        renderFileList(await new API.File("/storage/share/").getFileList());
        pathSpan.addEventListener("click", function () {
            pathInput.style.display = "flex";
            pathSpan.style.display = "none";
            pathInput.focus();
            pathInput.select();
        });
        pathInput.addEventListener("keydown", async function (e) {
            if (e.key === "Enter") {
                if (pathInput.value.trim() === "") {
                    console.warn("Path input is empty, not changing path.");
                    return;
                }
                if (pathInput.value === pathSpan.textContent) {
                    pathInput.style.display = "none";
                    pathSpan.style.display = "flex";
                    return;
                }
                if (!pathInput.value.endsWith("/")) pathInput.value += "/";
                const file = new API.File(pathInput.value);
                if (!await file.exist(pathInput.value)) {
                    console.error("File does not exist:", pathInput.value);
                    dialog.showDialog("文件或文件夹不存在", "", "", "确定", "确定", "center", "");
                    return;
                }
                pathInput.style.display = "none";
                pathSpan.textContent = pathInput.value;
                pathSpan.style.display = "flex";
                document.querySelector(".tab.active .tab-path").innerText = pathInput.value;
                renderFileList(await file.getFileList());
            }
        });
        pathInput.addEventListener("blur", function () {
            pathInput.style.display = "none";
            pathSpan.style.display = "flex";
            pathInput.value = pathSpan.textContent;
        });
    } catch (error) {
        console.error("Error in load event:", error);
    }
    const close = document.getElementById("close");
    close.addEventListener("click", function () {
        API.postMessage({ type: "close" });
    });
    document.getElementById("fileListMain").addEventListener("click", function (e) {
        console.log(e.target.tagName);
        document.querySelectorAll(".folder.selected").forEach(f => {
            if (e.target.tagName != "TD") f.classList.remove("selected");
        });
        document.querySelectorAll(".file.selected").forEach(f => {
            if (e.target.tagName != "TD") f.classList.remove("selected");
        });
    });
    document.getElementById("fileListMain").addEventListener("contextmenu", function (e) {
        e.preventDefault();
        const { target } = e;
        console.dir(target);
        if (target.id == "fileListMain") { }
    });
});

async function renderFileList(list) {
    const { files, folders } = list;
    const pathSpan = document.querySelector("#path span");
    const pathInput = document.querySelector("#path input");
    const fileList = document.getElementById("fileList");
    const noFile = document.getElementById("noFile");
    const base = pathSpan.textContent;
    console.log(base);
    fileList.innerHTML = `<thead>
    <tr>
        <th>名称</th>
        <th>类型</th>
        <th>最后修改时间</th>
        <th>大小</th>
    </tr>
</thead>`;
    console.log(fileList);
    if (files.length == 0 && folders.length == 0) {
        noFile.style.display = "block";
        return;
    }
    noFile.style.display = "none";
    folders.forEach(async folder => {
        const row = document.createElement("tr");
        row.className = "folder";
        const f = await new API.File(folder, base).get();
        row.innerHTML = `<td class="name">${folder}</td><td class="type">${getFileType(f)}</td><td class="time">${new Date(f.lastModified).toLocaleString()}</td><td class="size"></td>`;
        row.addEventListener("dblclick", async function () {
            pathSpan.textContent += folder + "/";
            pathInput.value = pathSpan.textContent;
            document.querySelector(".tab.active .tab-path").innerText = pathSpan.textContent;
            renderFileList(await new API.File(folder, base).getFileList());
        });
        row.addEventListener("click", function () {
            console.log(isCtrl);
            if (!isCtrl) {
                if (document.querySelector(".folder.selected")) {
                    document.querySelectorAll(".folder").forEach(f => f.classList.remove("selected"));
                }
            }
            row.classList.add("selected");
        });
        row.addEventListener("rightclick", function (e) {
            e.preventDefault();
            if (document.querySelector(".folder.selected")) {
                document.querySelectorAll(".folder").forEach(f => f.classList.remove("selected"));
            }
            row.classList.add("selected");
        });
        fileList.appendChild(row);
    });
    files.forEach(async file => {
        const row = document.createElement("tr");
        row.className = "file";
        const f = await new API.File(file, base).get();
        row.innerHTML = `<td class="name">${file}</td><td class="type">${getFileType(f)}</td><td class="time">${new Date(f.lastModified).toLocaleString()}</td><td class="size">${f.size}</td>`;
        row.addEventListener("click", function () {
            console.log(isCtrl);
            if (!isCtrl) {
                if (document.querySelector(".file.selected")) {
                    document.querySelectorAll(".file").forEach(f => f.classList.remove("selected"));
                }
            }
            row.classList.add("selected");
        });
        row.addEventListener("rightclick", function (e) {
            e.preventDefault();
            if (document.querySelector(".file.selected")) {
                document.querySelectorAll(".file").forEach(f => f.classList.remove("selected"));
            }
            row.classList.add("selected");
        });
        fileList.appendChild(row);
    });
}

function getFileType(file) {
    if (!file) return "未知";
    console.log("getFileType", file);
    if (file.type == "directory") return "文件夹";
    if (file.type == "file") {
        const filename = file.name.toLowerCase();
        if (filename.endsWith(".txt")) return "文本文件";
        if (filename.toLowerCase().endsWith(".jpg") || file.name.endsWith(".png") || file.name.endsWith(".gif")) return "图片文件";
        if (filename.endsWith(".mp4") || file.name.endsWith(".avi")) return "视频文件";
        if (filename.endsWith(".mp3") || file.name.endsWith(".wav")) return "音频文件";
        if (filename.endsWith(".zip") || file.name.endsWith(".rar")) return "压缩文件";
        if (filename.endsWith(".md")) return "Markdown文件";
        if (filename.endsWith(".xml")) return "可扩展标记语言文件";
        if (filename.endsWith(".exe")) return "可执行文件";
        if (filename.endsWith(".json")) return "JavaScript对象表示法文件";
        if (filename.endsWith(".html") || file.name.endsWith(".htm")) return "网页文件";
        if (filename.endsWith(".css")) return "层叠样式表文件";
        if (filename.endsWith(".js")) return "JavaScript文件";
        if (filename.endsWith(".svg")) return "矢量图形文件";
        if (filename.endsWith(".log")) return "日志文件";
        return filename.split(".").pop().toUpperCase() + "文件";
    }
}

function newTab(name, path) {
    try {
        const tab = document.createElement("div");
        tab.className = "tab";
        tab.innerHTML = `<span class="tab-name">${name}</span><br><span class="tab-path">${path}</span><button class="close">x</button>`;
        tab.addEventListener("click", async function (e) {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const pathSpan = document.querySelector("#path span");
            const pathInput = document.querySelector("#path input");
            pathSpan.textContent = document.querySelector(".tab.active .tab-path").innerText;
            renderFileList(await new API.File(document.querySelector(".tab.active .tab-path").innerText).getFileList());
            e.stopPropagation();
        });
        tab.querySelector(".close").addEventListener("click", async function (e) {
            tab.remove();
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            if (document.querySelectorAll(".tab").length > 0) {
                const otherTab = document.querySelectorAll(".tab")[document.querySelectorAll(".tab").length - 1];
                otherTab.classList.add("active");
                renderFileList(await new API.File(otherTab.querySelector(".tab-path").innerText).getFileList());
            }
            if (document.querySelectorAll(".tab").length == 0) {
                document.querySelector("#close").click();
            }
            e.stopPropagation();
        });
        console.log(tab);
        const tabsContainer = document.getElementById("tabs");
        if (!tabsContainer) {
            console.error("Tabs container not found");
            return;
        }
        console.log("Tab element type:", typeof tab);
        console.log("Tab element:", tab);
        console.log("Tabs container type:", typeof tabsContainer);
        console.log("Tabs container:", tabsContainer);
        if (!(tab instanceof Element)) {
            console.error("Tab is not a valid Element:", tab);
            return;
        }
        tabsContainer.appendChild(tab);
        console.log("newTab", name, path);
    } catch (error) {
        console.error("Error creating tab:", error);
        console.error("Error stack:", error.stack);
    }
}