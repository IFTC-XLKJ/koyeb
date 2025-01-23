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
        if (previewFrame.contentDocument.title) {
            docTitle.innerText = previewFrame.contentDocument.title;
        } else {
            docTitle.innerHTML = `<em style="color: grey;">未命名标题</em>`;
        }
    }, 300)
})
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
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    // 使用正则表达式提取 <!DOCTYPE 和 </html> 之间的内容
    const match = code.match(/<!DOCTYPE.*?<\/html>/s);
    if (match && match[0]) {
        return match[0];
    } else {
        return code; // 如果没有匹配到，返回原始代码
    }
}

addEventListener("resize", e => {
    const docTitle = document.getElementById("docTitle");
    docTitle.style.width = `${innerWidth * 0.3}px`;
})