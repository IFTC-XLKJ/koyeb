const pathToMedia = "/static/blockly/package/media/";
addEventListener("load", e => {
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
    console.log('Workspace initialized:', workspace);
    loadBlocks(initBlocks())
    workspace.registerButtonCallback("createVar", function (ws) {
        Blockly.Variables.createVariableButtonHandler(workspace, null, 'any')
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
})

function newFile() {
    location.href = "/noob/editor"
}

function saveFileAs() {
    const filename = "新的NOOB作品.nb";
    const file = new Blob([JSON.stringify(saveBlocks(), null, 4)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
}

function exportFile() {
    const filename = "新的NOOB作品.html";
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
        code = `<div style="color: red;">${e.message}</div>`;
    }
    const match = code.match(/<!DOCTYPE.*?<\/html>/s);
    if (match && match[0]) {
        return match[0];
    } else {
        return code;
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