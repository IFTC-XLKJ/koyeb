globalThis.isSaved = true;
const pathToMedia = "/static/blockly/package/media/";
setTimeout(function () {
    const loadingSrc = document.getElementById('waitLoad');
    loadingSrc.style.display = "none";
}, 200);
Blockly.Msg["CONTROLS_IF_MSG_THEN"] = "";
console.log("加载完成");
const options = {
    toolbox: toolbox,
    renderer: "Zelos",
    media: pathToMedia,
    grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
    },
    trashcan: false,
    move: {
        scrollbars: {
            horizontal: true,
            vertical: true
        },
        drag: true,
        wheel: true
    },
    zoom: {
        controls: true,
        wheel: true,
        maxScale: 5,
        minScale: 0.1,
        scaleSpeed: 1.5
    },
    useDoubleClick: false,
    bumpNeighbours: false,
    multiFieldUpdate: true,
    workspaceAutoFocus: true,
    multiselectIcon: {
        hideIcon: false,
        weight: 3,
        enabledIcon: 'https://github.com/mit-cml/workspace-multiselect/raw/main/test/media/select.svg',
        disabledIcon: 'https://github.com/mit-cml/workspace-multiselect/raw/main/test/media/unselect.svg',
    },
    multiSelectKeys: ['Ctrl'],
    multiselectCopyPaste: {
        crossTab: true,
        menu: true,
    },
}
globalThis.workspace = Blockly.inject('editor', options);
const workspaceSearch = new WorkspaceSearch(workspace);
workspaceSearch.init();
document.querySelector(".blockly-ws-search input").style.outline = "none";
addEventListener("keydown", e => {
    const { key, ctrlKey, shiftKey } = e;
    if (ctrlKey && shiftKey && key == "F") workspaceSearch.open();
    if (key == "Escape") workspaceSearch.close();
});
const multiselectPlugin = new Multiselect(workspace);
multiselectPlugin.init(options);
workspace.addChangeListener(shadowBlockConversionChangeListener);
console.log('Workspace initialized:', workspace);
loadBlocks(initBlocks())
workspace.registerButtonCallback("createVar", function (ws) {
    const mask = document.createElement("div");
    mask.style.position = "fixed";
    mask.style.top = "0";
    mask.style.left = "0";
    mask.style.width = "100vw";
    mask.style.height = "100vh";
    mask.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    mask.style.zIndex = "99999";
    const main = document.createElement("div");
    main.style.position = "fixed";
    main.style.top = "50vh";
    main.style.left = "50vw";
    main.style.transform = "translate(-50%, -50%)";
    main.style.backgroundColor = "white";
    main.style.borderRadius = "5px";
    main.style.padding = "10px";
    main.innerHTML = `<h1 style="text-align: center;">创建变量</h1>
<div>
    <label for="varName">变量名:</label>
    <input type="text" id="varName" style="outline: none;border: none;border-bottom: 1px solid #ccc;padding: 5px;">
    <p id="tips" style="color: red;display: none;margin: 0;padding: 0;">&nbsp;</p>
</div>
<div style="float: right;">
    <button id="cancel" style="border: none;width: 50px;height: 30px;border-radius: 5px;margin: 5px;cursor: pointer;">取消</button>
    <button id="confirm" onclick="mask.remove();createVar()" style="border: none;width: 50px;height: 30px;border-radius: 5px;margin: 5px;cursor: pointer;background-color: lightskyblue;color: white;">确定</button>
</div>`
    mask.appendChild(main);
    document.body.appendChild(mask);
    const varName = document.getElementById("varName");
    const cancel = document.getElementById("cancel");
    const confirm = document.getElementById("confirm");
    cancel.addEventListener("click", e => mask.remove())
    confirm.addEventListener("click", e => {
        varName.value = varName.value.trim();
        const name = varName.value;
        if (name.length === 0) {
            tips.innerText = "不能为空";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (!Number.isNaN(Number(name))) {
            tips.innerText = "不能为数字";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "_") {
            tips.innerText = "不能以_开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "@") {
            tips.innerText = "不能以@开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (!Number.isNaN(Number(name.slice(0, 1)))) {
            tips.innerText = "不能以数字开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "%") {
            tips.innerText = "不能以%开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "&") {
            tips.innerText = "不能以&开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "*") {
            tips.innerText = "不能以*开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "!") {
            tips.innerText = "不能以!开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "?") {
            tips.innerText = "不能以?开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "=") {
            tips.innerText = "不能以=开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "+") {
            tips.innerText = "不能以+开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "-") {
            tips.innerText = "不能以-开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "~") {
            tips.innerText = "不能以~开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "^") {
            tips.innerText = "不能以^开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === ":") {
            tips.innerText = "不能以:开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "|") {
            tips.innerText = "不能以|开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "`") {
            tips.innerText = "不能以`开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "\\") {
            tips.innerText = "不能以\\开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "\"") {
            tips.innerText = "不能以\"开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "\'") {
            tips.innerText = "不能以\'开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.includes(" ")) {
            tips.innerText = "变量名不能有空格";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (vars.find(v => v[0] === name)) {
            tips.innerText = "变量已存在";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        vars = [[name, encodeURIComponent(name).replaceAll("%", "_")], ...vars]
        mask.remove();
    })
})
workspace.registerButtonCallback("renameVar", function (ws) {
    let options = vars.map(v => v[0])
    const mask = document.createElement("div");
    mask.style.position = "fixed";
    mask.style.top = "0";
    mask.style.left = "0";
    mask.style.width = "100vw";
    mask.style.height = "100vh";
    mask.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    mask.style.zIndex = "99999";
    const main = document.createElement("div");
    main.style.position = "fixed";
    main.style.top = "50vh";
    main.style.left = "50vw";
    main.style.transform = "translate(-50%, -50%)";
    main.style.backgroundColor = "white";
    main.style.borderRadius = "5px";
    main.style.padding = "10px";
    main.innerHTML = `<h1 style="text-align: center;">重命名变量</h1>
<div>
    <label for="varName">变量名:</label>
    <select id="oldVarName" style="outline: none;border: none;border-bottom: 1px solid #ccc;padding: 5px;width: 100px;">
        ${options.map(v => `<option value="${v}">${v}</option>`)}}
    </select>
    <input type="text" id="varName" style="outline: none;border: none;border-bottom: 1px solid #ccc;padding: 5px;">
    <p id="tips" style="color: red;display: none;margin: 0;padding: 0;">&nbsp;</p>
</div>
<div style="float: right;">
    <button id="cancel" style="border: none;width: 50px;height: 30px;border-radius: 5px;margin: 5px;cursor: pointer;">取消</button>
    <button id="confirm" onclick="mask.remove();createVar()" style="border: none;width: 50px;height: 30px;border-radius: 5px;margin: 5px;cursor: pointer;background-color: lightskyblue;color: white;">确定</button>
</div>`
    mask.appendChild(main);
    document.body.appendChild(mask);
    const oldVarName = document.getElementById("oldVarName");
    const varName = document.getElementById("varName");
    const cancel = document.getElementById("cancel");
    const confirm = document.getElementById("confirm");
    cancel.addEventListener("click", e => mask.remove());
    confirm.addEventListener("click", e => {
        varName.value = varName.value.trim();
        const name = varName.value;
        if (name.length === 0) {
            tips.innerText = "不能为空";
            tips.style.display = "flex";
            setTimeout(() => tips.style.display = "none", 2000);
            return;
        }
        if (!Number.isNaN(Number(name))) {
            tips.innerText = "不能为数字";
            tips.style.display = "flex";
            setTimeout(() => tips.style.display = "none", 2000);
            return;
        }
        if (name.slice(0, 1) === "_") {
            tips.innerText = "不能以_开头";
            tips.style.display = "flex";
            setTimeout(() => tips.style.display = "none", 2000);
            return;
        }
        if (name.slice(0, 1) === "@") {
            tips.innerText = "不能以@开头";
            tips.style.display = "flex";
            setTimeout(() => tips.style.display = "none", 2000);
            return;
        }
        if (!Number.isNaN(Number(name.slice(0, 1)))) {
            tips.innerText = "不能以数字开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "%") {
            tips.innerText = "不能以%开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "&") {
            tips.innerText = "不能以&开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "*") {
            tips.innerText = "不能以*开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "!") {
            tips.innerText = "不能以!开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "?") {
            tips.innerText = "不能以?开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "=") {
            tips.innerText = "不能以=开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "+") {
            tips.innerText = "不能以+开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "-") {
            tips.innerText = "不能以-开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "~") {
            tips.innerText = "不能以~开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "^") {
            tips.innerText = "不能以^开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === ":") {
            tips.innerText = "不能以:开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "|") {
            tips.innerText = "不能以|开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "`") {
            tips.innerText = "不能以`开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "\\") {
            tips.innerText = "不能以\\开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "\"") {
            tips.innerText = "不能以\"开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.slice(0, 1) === "\'") {
            tips.innerText = "不能以\'开头";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        if (name.includes(" ")) {
            tips.innerText = "变量名不能有空格";
            tips.style.display = "flex";
            setTimeout(() => tips.style.display = "none", 2000);
            return;
        }
        if (vars.find(v => v[0] === name)) {
            tips.innerText = "变量已存在";
            tips.style.display = "flex";
            setTimeout(() => tips.style.display = "none", 2000);
            return;
        }
        const oldName = oldVarName.value;
        vars.forEach(v => { if (v[0] === oldName) v[0] = name });
        mask.remove();
    });
});
workspace.registerButtonCallback("deleteVar", function (ws) {
    let options = vars.map(v => v[0])
    const mask = document.createElement("div");
    mask.style.position = "fixed";
    mask.style.top = "0";
    mask.style.left = "0";
    mask.style.width = "100vw";
    mask.style.height = "100vh";
    mask.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    mask.style.zIndex = "99999";
    const main = document.createElement("div");
    main.style.position = "fixed";
    main.style.top = "50vh";
    main.style.left = "50vw";
    main.style.transform = "translate(-50%, -50%)";
    main.style.backgroundColor = "white";
    main.style.borderRadius = "5px";
    main.style.padding = "10px";
    main.innerHTML = `<h1 style="text-align: center;">删除变量</h1>
<div>
    <label for="varName">变量名:</label>
    <select id="varName" style="outline: none;border: none;border-bottom: 1px solid #ccc;padding: 5px;width: 100px;">
        ${options.map(v => `<option value="${v}">${v}</option>`)}}
    </select>
    <p id="tips" style="color: red;display: none;margin: 0;padding: 0;">&nbsp;</p>
</div>
<div style="float: right;">
    <button id="cancel" style="border: none;width: 50px;height: 30px;border-radius: 5px;margin: 5px;cursor: pointer;">取消</button>
    <button id="confirm" onclick="mask.remove();createVar()" style="border: none;width: 50px;height: 30px;border-radius: 5px;margin: 5px;cursor: pointer;background-color: lightskyblue;color: white;">确定</button>
</div>`
    mask.appendChild(main);
    document.body.appendChild(mask);
    const varName = document.getElementById("varName");
    const cancel = document.getElementById("cancel");
    const confirm = document.getElementById("confirm");
    cancel.addEventListener("click", e => mask.remove());
    confirm.addEventListener("click", e => {
        const name = varName.value;
        if (vars.length === 1) {
            tips.innerText = "必须保留一个变量（不保留会报错）";
            tips.style.display = "flex";
            setTimeout(() => tips.style.display = "none", 2000);
            return;
        }
        vars = vars.filter(v => v[0] != name);
        mask.remove();
    });
});
const previewFrame = document.getElementById("previewFrame");
const docTitle = document.getElementById("docTitle");
docTitle.style.width = `${innerWidth * 0.3}px`;
let lastCode = BlocksToJS();
setInterval(function () {
    const code = BlocksToJS();
    if (lastCode !== code) {
        lastCode = code;
        previewFrame.srcdoc = code;
        previewFrame.onload = function () {
            let frameTitle = previewFrame.contentDocument.title;
            if (frameTitle) {
                docTitle.innerText = frameTitle;
            } else {
                docTitle.innerHTML = `<em style="color: grey;">未命名标题</em>`;
            }
            Object.defineProperty(previewFrame.contentDocument, "title", {
                get() {
                    return frameTitle;
                },
                set(value) {
                    frameTitle = value;
                    if (frameTitle) {
                        docTitle.innerText = frameTitle;
                        return;
                    }
                    docTitle.innerHTML = `<em style="color: grey;">未命名标题</em>`;
                }
            })
        }
    }
}, 300);
const file = document.getElementById("file");
const fileMenu = document.getElementById("fileMenu");
file.addEventListener("click", e => {
    e.preventDefault();
    if (fileMenu.dataset.navMenu == "show") fileMenu.dataset.navMenu = "hidden";
    else {
        fileMenu.dataset.navMenu = "show";
        addEventListener("click", e => {
            if (e.target.id == "file") return;
            fileMenu.dataset.navMenu = "hidden";
        });
    }
})
globalThis.cacheTitle = "新的NOOB作品";
document.getElementById("title").querySelector("input").addEventListener("change", async function (e) {
    if (e.target.value.trim() == "") {
        e.target.value = globalThis.cacheTitle;
        const toast = new Toast();
        toast.showToast("标题不能为空", 2, "center", "small", "error", false, true);
        return;
    }
    globalThis.cacheTitle = e.target.value.trim();
})

save.addEventListener("click", async function () {
    const ID = localStorage.getItem("ID");
    const password = localStorage.getItem("password");
    const NID = new URLSearchParams(location.search).get("nid") || "new";
    console.log(ID, password, NID);
    if (ID && password) {
        try {
            const toast = new Toast();
            const lid = toast.loading("保存中");
            const html = BlocksToJS();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const scripts = doc.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                const script = scripts[i];
                const code = script.textContent;
                const newCode = obfuscate(code);
                script.textContent = newCode;
            }
            const newHtml = doc.documentElement.outerHTML;
            const work = {
                name: getWorkName(),
                blocks: saveBlocks().blocks,
                code: newHtml,
                vars: vars
            }
            const formData = new FormData();
            formData.append("path", "noob/work/" + Date.now());
            formData.append("file", new File([JSON.stringify(work)], "work.nb"), "work.nb");
            const r = await fetch("https://api.pgaot.com/user/up_cat_file", {
                method: "POST",
                body: formData,
                redirect: 'follow'
            });
            const j = await r.json();
            if (j.code == 200) {
                const url = j.url;
                const res = await fetch(`/api/noob/save?ID=${ID}&password=${encodeURIComponent(password)}&file=${url}&nid=${NID}`);
                const json = await res.json();
                if (json.code == 200) {
                    toast.hideToast(lid);
                    toast.showToast("保存成功", 2, "center", "small", "success", false, false);
                    if (NID == "new") {
                        updateURLParameter('nid', json.nid);
                    }
                    function updateURLParameter(param, value) {
                        let url = new URL(window.location.href);
                        url.searchParams.set(param, value);
                        window.history.replaceState(null, "", url.toString());
                    }
                    globalThis.isSaved = true;
                } else if (json.code == 401) {
                    alert("鉴权失败，需重新登录");
                    localStorage.removeItem("ID");
                    localStorage.removeItem("password");
                    window.location.href = "/login";
                    return;
                }
            } else {
                toast.showToast(r.message, 2, "center", "small", "error", false, true);
                toast.hideToast(lid);
            }
        } catch (e) {
            toast.showToast(e.message, 2, "center", "small", "error", false, true);
            toast.hideToast(lid);
        }
    } else {
        alert("请先登录");
        location.href = "/login";
    }
});

publish.addEventListener("click", async function () {
    const ID = localStorage.getItem("ID");
    const password = localStorage.getItem("password");
    const NID = new URLSearchParams(location.search).get("nid");
    if (ID && password) {
        if (!NID) {
            alert("请先确保作品已保存到云端");
            return;
        }
        const toast = new Toast();
        const lid = toast.loading("正在发布");
        try {
            const r = await fetch("/api/noob/publish?ID=" + ID + "&password=" + encodeURIComponent(password) + "&nid=" + NID);
            const j = await r.json();
            if (j.code != 200) {
                if (j.code == 401) {
                    toast.hideToast(lid);
                    toast.showToast("鉴权失败，请重新登录", 2, "center", "small", "error", false, true);
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 2000);
                    return;
                }
                toast.hideToast(lid);
                toast.showToast(j.message, 2, "center", "small", "error", false, true);
                return;
            }
            toast.hideToast(lid);
            toast.showToast("发布成功", 2, "center", "small", "success", false, true);
            open(`share/${NID}`, "_blank");
        } catch (e) {
            toast.hideToast(lid);
            toast.showToast("发布失败，原因：" + e.message, 2, "center", "small", "error", false, true);
        }
    } else {
        alert("请先登录")
        location.href = "/login";
    }
});

workspace.addChangeListener(function (e) {
    console.log(e);
    if (e.type == "create" && e.ids[0] == "doc_type") return;
    if (e.type == "create" || e.type == "change" || e.type == "delete" || e.type == "move" || e.type == "comment_change" || e.type == "comment_create" || e.type == "comment_delete" || e.type == "viewport_change") {
        globalThis.isSaved = false;
    }
})

workspace.registerButtonCallback("goToNOOBcss", function (e) {
    console.log("goToNOOBcss", e);
    nativeOpen("https://noobcss.deno.dev", "_blank")
})

function openHelp() {
    nativeOpen("https://noob.fandom.com/zh/wiki/Noob_Wiki", "__blank");
}

function newFile() {
    location.href = "/noob/editor";
}

function saveFileAs() {
    const filename = getWorkName() + ".nb";
    const file = new Blob([JSON.stringify(saveBlocks(), null, 4)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
}

function exportFile() {
    const filename = getWorkName() + ".html";
    const html = BlocksToJS();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const scripts = doc.querySelectorAll("script");
    for (var i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const code = script.textContent;
        const newCode = obfuscate(code);
        script.textContent = newCode;
    }
    const newHtml = doc.documentElement.outerHTML;
    const file = new Blob([newHtml], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
}

function importFile() {
    const file = document.createElement("input");
    file.type = "file";
    file.accept = ".nb";
    file.click();
    file.addEventListener("change", e => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = e => {
                const blocks = JSON.parse(e.target.result);
                if (blocks.blocks.length === 0) return;
                if (blocks.blocks.blocks[0].type != "doc_type") return;
                if (blocks.blocks.blocks[0].next.block.type != "element_html") return;
                if (blocks.blocks.blocks[0].next.block.inputs.html.block.type != "element_head") return;
                if (blocks.blocks.blocks[0].next.block.inputs.html.block.next.block.type != "element_body") return;
                loadBlocks(blocks);
            };
        }
    });
}

function getWorkName() {
    const title = document.getElementById("title").children[0].value;
    return title;
}

function initBlocks() {
    return {
        blocks: {
            languageVersion: 0,
            blocks: [
                {
                    type: "doc_type",
                    id: "doc_type",
                    icons: {
                        comment: {
                            text: "网页主体部分，只有将积木放在网页主体部分内才有效",
                            pinned: true,
                            height: 45.33,
                            width: 408.66
                        }
                    },
                    x: 200,
                    y: 250,
                    fields: {
                        DOCTYPE: "html"
                    },
                    next: {
                        block: {
                            type: "element_html",
                            id: "element_html",
                            inputs: {
                                html: {
                                    block: {
                                        type: "element_head",
                                        id: "element_head",
                                        next: {
                                            block: {
                                                type: "element_body",
                                                id: "element_body"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        }
    }
}

function open() {
    const ID = localStorage.getItem("ID")
    const password = localStorage.getItem("password")
    if (!ID || !password) {
        toast.showToast("请先登录", 3000, "center", "small", "error", false, false);
        window.location.href = "/login"
    }
}

function loadBlocks(blocks) {
    Blockly.serialization.workspaces.load(blocks, workspace);
}
function saveBlocks() {
    return Blockly.serialization.workspaces.save(workspace);
}

function translateWorkspace(x, y) {
    workspace.getCanvas().translate(x, y);
}

function scrollToPosition(x, y) {
    workspace.scrollXY(x, y);
}

function focusAndMoveBlock(blockId, x, y) {
    const block = workspace.getBlockById(blockId);
    if (block) block.moveTo(x, y);

}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function BlocksToJS() {
    let code;
    try {
        code = Blockly.JavaScript.workspaceToCode(workspace);
    } catch (e) {
        console.error(e);
        code = `<div style="color: red;background-color: #eee;border-radius: 5px;"><pre><code>${(e.stack || e.message || e)
            .replaceAll("\n", "<br>")
            .replaceAll(" ", "&nbsp;")}<\/code><\/pre></div>`;
        console.error(e);
    }
    const match = code.match(/<!DOCTYPE.*?<\/html>/s);
    if (match && match[0]) return defineVars() + match[0];
    else return defineVars() + `<script src=""><\/script>` + code + `<link rel="icon" href="https://iftc.koyeb.app/static/NOOB.svg">`;

}

addEventListener("resize", e => {
    const docTitle = document.getElementById("docTitle");
    docTitle.style.width = `${innerWidth * 0.3}px`;
})

function replaceFirstAndLastChar(str, firstChar, lastChar) {
    if (str.length < 2) return str;
    return firstChar + str.slice(1, -1) + lastChar;
}

function defineVars() {
    let html = `<script>`;
    vars.forEach(v => html += `let ${v[1]};`);
    html += `<\/script>`;
    return html;
}

function obfuscate(code) {
    return JavaScriptObfuscator.obfuscate(code,
        {
            compact: false,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1
        }
    ).getObfuscatedCode();
}

(async function () {
    const ID = localStorage.getItem('ID');
    const password = localStorage.getItem('password');
    const nid = new URLSearchParams(location.search).get('nid');
    if (nid && (!ID || !password)) {
        alert("请先登录");
        location.href = '/login?page=/noob/editor?nid' + nid;
        return;
    }
    if (nid) {
        const toast = new Toast();
        const lid = toast.loading("正在打开作品...");
        try {
            const response = await fetch(`/api/noob/get?ID=${ID}&password=${encodeURIComponent(password)}&nid=${nid}`);
            const data = await response.json();
            if (data.code == 200) {
                const url = data.data.url;
                const workres = await fetch(url);
                const work = await workres.json();
                const title = work.name;
                document.getElementById("title").querySelector("input").value = title;
                loadBlocks(work);
                toast.hideToast(lid);
            } else if (data.code == 403) {
                toast.hideToast(lid);
                alert("你没有权限打开此作品");
                location.href = '/noob/editor';
                return;
            } else {
                toast.hideToast(lid);
                alert("打开作品失败");
                location.href = '/noob/editor';
                return;
            }
        } catch (error) {
            console.error(error);
            toast.hideToast(lid);
            alert("打开作品失败\n" + error.stack);
            location.href = '/noob/editor';
            return;
        }
    }
})();

const beforeunloadHandler = (event) => {
    if (isSaved) return;
    event.preventDefault();
    event.returnValue = true;
};
addEventListener("beforeunload", beforeunloadHandler);