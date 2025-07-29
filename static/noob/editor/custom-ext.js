globalThis.Exts = {};
globalThis.loadCustomExt = async function (obj) {
    if (obj instanceof Object) {
        const { types, Ext } = obj;
        if (types instanceof Object) {
            const { name, color, version, author, blocks } = types;
            let exit = false;
            let cover = false;
            let i = 0;
            for (const content of toolbox.contents) {
                if (content.kind == "category" && content.name == name) {
                    cover = confirm("是否覆盖 " + name + " ?")
                    if (!cover) {
                        exit = true;
                        break;
                    }
                    if (cover) {
                        toolbox.contents[i] = content;
                    }
                }
                i++;
            }
            if (exit) return;
            if (Ext instanceof Function) {
                if (!cover) {
                    toolbox.contents.push({
                        kind: "category",
                        name: name,
                        colour: color,
                        contents: parseBlocks(blocks, name)
                    });
                }
                Blockly.defineBlocksWithJsonArray(parseBlocksWithDefine(blocks, name));
                blocks.forEach(block => {
                    const { key } = block;
                    Blockly.JavaScript.forBlock["custom_" + name + "_" + key] = function (block) {
                        if (Exts[name][key].__proto__[Symbol.toStringTag] == "AsyncFunction") {
                            return `await Exts[${name}][${key}]()`;
                        } else {
                            return `Exts[${name}][${key}]()`;
                        }
                    }
                });
                workspace.updateToolbox(toolbox);
                Exts[name] = Ext;
            } else {
                alert("无法加载扩展，请检查扩展导出的格式是否正确");
            }
        } else {
            alert("无法加载扩展，请检查扩展导出的格式是否正确");
        }
    } else {
        alert("无法加载扩展，请检查扩展导出的格式是否正确");
    }
    function parseBlocks(blocks, name) {
        const newBlocks = [];
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const newBlock = {};
            const key = "custom_" + name + "_" + block.key;
            newBlock.kind = "block";
            newBlock.type = key;
            if (block.labelText) {
                newBlocks.push({
                    kind: "label",
                    text: block.labelText,
                })
            }
            newBlocks.push(newBlock);
        }
        console.log(newBlocks);
        return newBlocks;
    }
    function parseBlocksWithDefine(blocks, name) {
        const newBlocks = [];
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const newBlock = {};
            newBlock.type = "custom_" + name + "_" + block.key;
            newBlock.output = block.valueType;
            newBlock.colour = block.color;
            newBlock.tooltip = block.tooltip;
            newBlock.helpUrl = block.helpUrl;
            newBlock.inputsInline = true;
            newBlock.nextStatement = newBlock.output ? null : void 0;
            newBlock.previousStatement = newBlock.output ? null : void 0;
            const params = block.params;
            let message = "";
            const args = [];
            params.forEach(param => {
                const label = param.label;
                message += label + " ";
            });
            newBlocks.push(newBlock);
        }
        console.log(newBlocks)
        return newBlocks;
    }
}