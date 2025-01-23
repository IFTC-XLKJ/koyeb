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
})
function initBlocks() {
    return {
        blocks: {
            languageVersion: 0,
            blocks: [
                {
                    type: "doc_type",
                    id: "doc_type",
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