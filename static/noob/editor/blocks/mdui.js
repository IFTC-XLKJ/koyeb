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
        message0: "MDUI 按钮 %1 适应宽度%2 禁用%3 加载%4 %5 %6",
        args0: [
            {
                type: "field_input",
                name: "LABEL",
                text: "button",
            },
            {
                type: "field_checkbox",
                name: "FIT",
                checked: false,
            },
            {
                type: "field_checkbox",
                name: "DISABLED",
                checked: false,
            },
            {
                type: "field_checkbox",
                name: "LOADING",
                checked: false,
            },
            {
                type: "input_value",
                name: "ATTRIBUTE",
                check: "Dictionary",
            },
            {
                type: "input_value",
                name: "STYLE",
                check: "Dictionary",
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
        message0: "MDUI 文本框 %1 %2 %3 %4",
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
            {
                type: "field_input",
                name: "VALUE",
                text: "Value",
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
        "--mdui-color-on-surface-variant": "180, 180, 180",
        "--mdui-color-surface-container-highest": "240, 240, 240",
        "--mdui-motion-duration-short4": "0.2s",
        "--mdui-motion-easing-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
        "--mdui-shape-corner-extra-small": "0.3rem",
        "--mdui-motion-easing-linear": "cubic-bezier(0, 0, 1, 1)",
        "--mdui-typescale-body-small-size": "0.75rem",
        "--mdui-typescale-body-small-weight": "400",
        "--mdui-typescale-body-small-tracking": "0.025rem",
        "--mdui-typescale-body-small-line-height": "1rem",
        "--mdui-typescale-body-large-size": "1rem",
        "--mdui-typescale-body-large-weight": "400",
        "--mdui-typescale-body-large-tracking": "0.01rem",
        "--mdui-typescale-body-large-line-height": "1.6rem",
        "--mdui-color-on-surface": "0, 0, 0, 0.87"
    };
    return `mduiTheme(${JSON.stringify(defaultTheme, null, 4)})`;
}

Blockly.JavaScript.forBlock["mdui_button"] = function (block) {
    const label = block.getFieldValue("LABEL");
    const fit = block.getFieldValue("FIT") == "TRUE" ? true : false;
    // console.log(fit);
    const disabled = block.getFieldValue("DISABLED") == "TRUE" ? true : false;
    const loading = block.getFieldValue("LOADING") == "TRUE" ? true : false;
    return `<mdui-button${fit ? ` full-width` : ""}${disabled ? ` disabled` : ""}${loading ? ` loading` : ""} style="color: rgba(var(--mdui-text-color));${handleAttrAndStyle(block)}">${label}</mdui-button>`;
}

Blockly.JavaScript.forBlock["mdui_text_field"] = function (block) {
    const label = block.getFieldValue("LABEL");
    const placeholder = block.getFieldValue("PLACEHOLDER");
    const helper = block.getFieldValue("HELPER");
    const value = block.getFieldValue("VALUE");
    return `<mdui-text-field${label ? ` label="${label}"` : ""}${placeholder ? ` placeholder="${placeholder}"` : ""}${helper ? ` helper="${helper}" helper-on-focus` : ""}${value ? ` value="${value}"` : ""}></mdui-text-field>`;
}