globalThis.Exts = {};
globalThis.ExtsCode = {};
globalThis.loadCustomExt = async function (obj, code) {
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
                    // 在 custom-ext.js 中找到这部分代码并修改
                    Blockly.JavaScript.forBlock["custom_" + name + "_" + key] = function (b) {
                        const paramsvalues = {};
                        const params = block.params;
                        params.forEach(param => {
                            if (param.inputValue) {
                                const { key } = param.inputValue;
                                paramsvalues[key] = Blockly.JavaScript.valueToCode(b, key, Blockly.JavaScript.ORDER_NONE);
                            } else if (param.dropdown) {
                                const { key } = param.dropdown;
                                paramsvalues[key] = b.getFieldValue(key);
                            }
                        });

                        // 判断是语句块还是值块
                        if (block.valueType) {
                            // 值块处理
                            if (Exts[name][key].__proto__[Symbol.toStringTag] == "AsyncFunction") {
                                return [`await Exts["${name}"]["${key}"](${JSON.stringify(paramsvalues)})`, Blockly.JavaScript.ORDER_AWAIT];
                            } else {
                                return [`Exts["${name}"]["${key}"](${JSON.stringify(paramsvalues)})`, Blockly.JavaScript.ORDER_NONE];
                            }
                        } else {
                            // 语句块处理 - 需要返回字符串代码
                            if (Exts[name][key].__proto__[Symbol.toStringTag] == "AsyncFunction") {
                                return `await Exts["${name}"]["${key}"](${JSON.stringify(paramsvalues)});\n`;
                            } else {
                                return `Exts["${name}"]["${key}"](${JSON.stringify(paramsvalues)});\n`;
                            }
                        }
                    }
                });
                workspace.updateToolbox(toolbox);
                Exts[name] = Ext;
                ExtsCode[name] = code;
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
            const params = block.params;
            const inputs = {};
            params.forEach(function (param) {
                if (param.inputValue) {
                    const checkType = param.inputValue.checkType;
                    switch (checkType) {
                        case "String":
                            inputs[param.inputValue.key] = {
                                shadow: {
                                    type: "text",
                                }
                            };
                            break;
                        case "Number":
                            inputs[param.inputValue.key] = {
                                shadow: {
                                    type: "math_number",
                                }
                            };
                            break;
                        case "Boolean":
                            inputs[param.inputValue.key] = {
                                shadow: {
                                    type: "logic_boolean",
                                }
                            };
                            break;
                        case "Object":
                            inputs[param.inputValue.key] = {
                                shadow: {
                                    type: "object_dict",
                                }
                            };
                            break;
                        case "Array":
                            inputs[param.inputValue.key] = {
                                shadow: {
                                    type: "array_create",
                                }
                            };
                            break;
                    }
                }
            });
            newBlock.inputs = inputs;
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
                newBlock.nextStatement = true;
                newBlock.previousStatement = true;
            }
            const params = block.params;
            let message = "";
            const args = [];
            let n = 0;
            params.forEach(param => {
                const label = param.label;
                if (param.inputValue) {
                    const inputValue = param.inputValue;
                    if (inputValue) {
                        const checkType = inputValue.checkType;
                        n++;
                        message += `${label} %${n} `
                        args.push({
                            type: "input_value",
                            name: inputValue.key,
                            check: checkType == "Number" ? "Number" : (checkType == "String" ? "String" : (checkType == "Object" ? "Dictionary" : checkType == "Array" ? "Array" : void 0))
                        })
                        return;
                    }
                } else if (param.dropdown) {
                    const dropdown = param.dropdown;
                    n++;
                    message += `${label} %${n} `
                    args.push({
                        type: "field_dropdown",
                        options: dropdown.options,
                        name: dropdown.key
                    })
                    return;
                }
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