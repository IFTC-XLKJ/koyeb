Blockly.defineBlocksWithJsonArray([
    {
        type: "mdui_design_token",
        message0: "MDUI 设计令牌 %1",
        args0: [
            {
                type: "field_dropdown",
                name: "TOKEN",
                options: [
                    ["主色", "\"--mdui-color-primary\""],
                    ["主前景色", "\"--mdui-color-on-primary\""],
                    ["逆色", "\"--mdui-color-inverse-primary\""],
                    ["副色", "\"--mdui-color-secondary\""],
                    ["副前景色", "\"--mdui-color-on-secondary\""],
                    ["辅助色", "\"--mdui-color-tertiary\""],
                    ["强调色", "\"--mdui-color-accent\""],
                    ["背景色", "\"--mdui-color-background\""],
                    ["表面色", "\"--mdui-color-surface\""],
                    ["错误色", "\"--mdui-color-error\""],
                    ["成功色", "\"--mdui-color-success\""],
                    ["警告色", "\"--mdui-color-warning\""],
                    ["信息色", "\"--mdui-color-info\""],
                    ["表面色调色", "\"--mdui-color-surface-tint-color\""],
                ],
            }
        ],
        colour: "#6750A4",
        tooltip: "设置 MDUI 设计令牌",
        helpUrl: "",
        inputsInline: true,
        output: "String",
    },
    {
        type: "mdui_theme",
        message0: "MDUI 主题 %1",
        args0: [
            {
                type: "input_value",
                name: "THEME",
                check: "Dictionary",
                align: "RIGHT",
            }
        ],
        colour: "#6750A4",
        tooltip: "设置 MDUI 主题",
        helpUrl: "",
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
    },
    {
        type: "mdui_theme_default",
        message0: "MDUI 默认主题",
        args0: [],
        colour: "#6750A4",
        tooltip: "设置 MDUI 默认主题",
        helpUrl: "",
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
    },
    {
        type: "mdui_button",
        message0: "MDUI 按钮 %1",
        args0: [
            {
                type: "field_input",
                name: "LABEL",
                text: "button",
            },
        ],
        colour: "#6750A4",
        tooltip: "添加一个 MDUI 按钮",
        helpUrl: "",
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
    },
    {
        type: "mdui_text_field",
        message0: "MDUI 文本框 %1 %2 %3",
        args0: [
            {
                type: "field_input",
                name: "LABEL",
                text: "Text Field",
            },
            {
                type: "field_input",
                name: "PLACEHOLDER",
                text: "Placeholder",
            },
            {
                type: "field_input",
                name: "HELPER",
                text: "Helper Text",
            },
        ],
        colour: "#6750A4",
        tooltip: "添加一个 MDUI 按钮",
        helpUrl: "",
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
    },
]);

Blockly.JavaScript.forBlock["mdui_design_token"] = function (block) {
    const token = block.getFieldValue("TOKEN");
    return [token, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock["mdui_theme"] = function (block) {
    const theme = Blockly.JavaScript.valueToCode(block, "THEME", Blockly.JavaScript.ORDER_ATOMIC);
    console.log(theme);
    return `mduiTheme(${theme});\n`;
}

Blockly.JavaScript.forBlock["mdui_theme_default"] = function (block) {
    const defaultTheme = {
        "--mdui-color-primary": "0, 192, 255",
        "--mdui-color-on-primary": "255, 255, 255, 0.3",
        "--mdui-text-color": "255, 255, 255",
        "--mdui-shape-corner-full": "1000rem",
        "--mdui-color-on-surface-variant": "200, 200, 200",
        "--mdui-color-surface-container-highest": "240, 240, 240",
        "--mdui-motion-duration-short4": "0.2s",
        "--mdui-motion-easing-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
    };
    return `mduiTheme(${JSON.stringify(defaultTheme, null, 4)})`;
}

Blockly.JavaScript.forBlock["mdui_button"] = function (block) {
    const label = block.getFieldValue("LABEL");
    return `<mdui-button style="color: rgba(var(--mdui-text-color));">${label}</mdui-button>`;
}

Blockly.JavaScript.forBlock["mdui_text_field"] = function (block) {
    const label = block.getFieldValue("LABEL");
    const placeholder = block.getFieldValue("PLACEHOLDER");
    const helper = block.getFieldValue("HELPER");
    return `<mdui-text-field${label ? ` label="${label}"` : ""}${placeholder ? ` placeholder="${placeholder}"` : ""}${helper ? ` helper="${helper}" helper-on-focus` : ""}></mdui-text-field>`;
}