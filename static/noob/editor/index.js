const pathToMedia = "/static/blockly/package/media/";
console.log("加载完成")
window.workspace = Blockly.inject('editor', {
    toolbox: toolbox,
    renderer: "Zelos",
    media: pathToMedia,
    grid:
    {
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
    }
});
const workspaceSearch = new WorkspaceSearch(workspace);
workspaceSearch.init();
addEventListener("keydown", e => {
    const { key, ctrlKey, shiftKey } = e;
    if (ctrlKey && shiftKey && key == "F") {
        workspaceSearch.open();
    }
    if (key == "Escape") {
        workspaceSearch.close();
    }
});
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
    cancel.addEventListener("click", e => {
        mask.remove();
    })
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
    cancel.addEventListener("click", e => {
        mask.remove();
    })
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
        const oldName = oldVarName.value;
        vars.forEach(v => {
            if (v[0] === oldName) {
                v[0] = name;
            }
        });
        mask.remove();
    })
})
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
    cancel.addEventListener("click", e => {
        mask.remove();
    })
    confirm.addEventListener("click", e => {
        const name = varName.value;
        if (vars.length === 1) {
            tips.innerText = "必须保留一个变量（不保留会报错）";
            tips.style.display = "flex";
            setTimeout(() => {
                tips.style.display = "none";
            }, 2000);
            return;
        }
        vars = vars.filter(v => v[0] != name)
        mask.remove();
    })
})
const previewFrame = document.getElementById("previewFrame");
const docTitle = document.getElementById("docTitle");
docTitle.style.width = `${innerWidth * 0.3}px`;
let lastCode = BlocksToJS();
setInterval(function () {
    const code = BlocksToJS();
    if (lastCode !== code) {
        lastCode = code;
        previewFrame.srcdoc = code;
    }
    if (previewFrame.contentDocument) {
        if (previewFrame.contentDocument.title) {
            docTitle.innerText = previewFrame.contentDocument.title;
        } else {
            docTitle.innerHTML = `<em style="color: grey;">未命名标题</em>`;
        }
    }
}, 300)
const file = document.getElementById("file");
const fileMenu = document.getElementById("fileMenu");
file.addEventListener("click", e => {
    e.preventDefault();
    if (fileMenu.dataset.navMenu == "show") {
        fileMenu.dataset.navMenu = "hidden";
    } else {
        fileMenu.dataset.navMenu = "show";
        addEventListener("click", e => {
            if (e.target.id == "file") {
                return;
            }
            fileMenu.dataset.navMenu = "hidden";
        });
    }
})

function newFile() {
    location.href = "/noob/editor"
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
    const file = new Blob([BlocksToJS()], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
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
    if (block) {
        block.moveTo(x, y);
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function BlocksToJS() {
    let code
    try {
        code = Blockly.JavaScript.workspaceToCode(workspace);
    } catch (e) {
        code = `<div style="color: red;background-color: #eee;border-radius: 5px;"><pre><code>${e.stack
            .replaceAll("\n", "<br>")
            .replaceAll(" ", "&nbsp;")}<\/code><\/pre></div>`;
        console.error(e);
    }
    const match = code.match(/<!DOCTYPE.*?<\/html>/s);
    if (match && match[0]) {
        return defineVars() + match[0];
    } else {
        return defineVars() + `<script src=""><\/script>` + code;
    }
}

addEventListener("resize", e => {
    const docTitle = document.getElementById("docTitle");
    docTitle.style.width = `${innerWidth * 0.3}px`;
})

function replaceFirstAndLastChar(str, firstChar, lastChar) {
    if (str.length < 2) {
        return str;
    }
    return firstChar + str.slice(1, -1) + lastChar;
}

function defineVars() {
    let html = `<script>`
    vars.forEach(v => {
        html += `let ${v[1]};`
    });
    html += `<\/script>`
    return html;
}