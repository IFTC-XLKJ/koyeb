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
                            return [`await Exts["${name}"]["${key}"]()`, Blockly.JavaScript.ORDER_NONE];
                        } else {
                            return [`Exts["${name}"]["${key}"]()`, Blockly.JavaScript.ORDER_NONE];
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
            if (block.valueType) {
                newBlock.output = block.valueType;
            }
            newBlock.colour = block.color;
            newBlock.tooltip = block.tooltip;
            newBlock.helpUrl = block.helpUrl;
            newBlock.inputsInline = true;
            if (newBlock.output == void 0 && typeof newBlock.output == "undefined") {
                newBlock.nextStatement = null;
                newBlock.previousStatement = null;
            }
            //  else if (newBlock.output != null) {
            //     newBlock.nextStatement = null;
            //     newBlock.previousStatement = null;
            // }
            const params = block.params;
            let message = "";
            const args = [];
            params.forEach(param => {
                const label = param.label;
                message += label + " ";
            });
            newBlock.message0 = message;
            newBlock.args0 = args;
            newBlocks.push(newBlock);
        }
        console.log(newBlocks)
        return newBlocks;
    }
}