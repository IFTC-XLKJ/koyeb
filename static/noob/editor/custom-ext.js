globalThis.Exts = {};
globalThis.loadCustomExt = async function (obj) {
    if (obj instanceof Object) {
        const { types, Ext } = obj;
        if (types instanceof Object) {
            const { name, color, version, author, blocks } = types;
            let exit = false;
            for (const content of toolbox.contents) {
                if (content.kind == "category" && content.name == name) {
                    if (!confirm("是否覆盖 " + name + " ?")) {
                        exit = true;
                        break;
                    }
                }
            }
            if (exit) return;
            if (Ext instanceof Function) {
                toolbox.contents.push({
                    kind: "category",
                    name: name,
                    colour: color,
                    contents: parseBlocks(blocks)
                });
                Blockly.defineBlocksWithJsonArray(parseBlocksWithDefine(blocks));
                const ext = new Ext();
                blocks.forEach(block => {
                    const { key } = block;
                    Blockly.Javascript.forBlock["custom_" + name + "_" + key] = async function (block) {
                        if (ext[key].__proto__[Symbol.toStringTag] == "AsyncFunction") {
                            return `await Exts[${name}][${key}]()`;
                        } else {
                            return `Exts[${name}][${key}]()`;
                        }
                    }
                });
                workspace.updateToolbox(toolbox);
                Exts[name] = {
                    ext: ext,
                    toolbox: toolbox
                };
            } else {
                alert("无法加载扩展，请检查扩展导出的格式是否正确");
            }
        } else {
            alert("无法加载扩展，请检查扩展导出的格式是否正确");
        }
    } else {
        alert("无法加载扩展，请检查扩展导出的格式是否正确");
    }
    function parseBlocks(blocks) {
        const newBlocks = [];
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const newBlock = {};
            const key = "custom_" + name + "_" + block.key;
            newBlock.kind = "block";
            newBlock.type = key;
            newBlocks.push(newBlock);
            if (block.labelText) {
                newBlocks.push({
                    kind: "label",
                    text: block.label,
                })
            }
        }
        console.log(newBlocks);
        return newBlocks;
    }
    function parseBlocksWithDefine(blocks) {
        const newBlocks = [];
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const newBlock = {};
            newBlock.type = "custom_" + name + "_" + block.key;
            const params = block.params;
        }
        console.log(newBlocks)
        return newBlocks;
    }
}