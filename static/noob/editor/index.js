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
                    id: "@pa;.kn/Z7|M,6_d^$=F",
                    x: 250,
                    y: 200,
                    fields: {
                        DOCTYPE: "html"
                    },
                    next: {
                        block: {
                            type: "element_html",
                            id: "y/K|%V(Z*|lSX`86:/7j",
                            inputs: {
                                html: {
                                    block: {
                                        type: "element_head",
                                        id: "9961vC4kkQWPIN.8hWKN",
                                        next: {
                                            block: {
                                                type: "element_body",
                                                id: "}pWzYD=S{8#I`B,e;im9"
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