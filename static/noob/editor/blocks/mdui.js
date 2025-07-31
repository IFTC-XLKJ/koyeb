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
        message0: "MDUI 文本框 %1 %2 %3 %4 最小字数%5 最大字数%6 %7 只读%8 禁用%9 计数%10",
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
            {
                type: "input_value",
                name: "MIN_LENGTH",
                check: "Number",
                optional: true
            },
            {
                type: "input_value",
                name: "MAX_LENGTH",
                check: "Number",
                optional: true
            },
            {
                type: "field_dropdown",
                name: "TYPE",
                options: [
                    ["文本", "text"],
                    ["数字", "number"],
                    ["密码", "password"],
                    ["链接", "url"],
                    ["邮箱", "email"],
                    ["搜索", "search"],
                    ["手机号", "tel"],
                    ["隐藏", "hidden"],
                    ["日期", "date"],
                    ["日期和时间", "datetime-local"],
                    ["年月", "month"],
                    ["时间", "time"],
                    ["周", "week"],
                ]
            },
            {
                type: "field_checkbox",
                name: "READONLY",
                checked: false,
            },
            {
                type: "field_checkbox",
                name: "DISABLED",
                checked: false,
            },
            {
                type: "field_checkbox",
                name: "COUNTER",
                checked: false,
            },
        ],
        colour: "#6750A4",
        tooltip: "添加一个 MDUI 文本输入框",
        helpUrl: "",
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
    },
    {
        type: "mdui_snackbar",
        message0: "弹出 MDUI 提示 %1 %2 操作按钮%3",
        args0: [
            {
                type: "input_value",
                name: "MESSAGE",
                check: "String",
            },
            {
                type: "field_dropdown",
                name: "PLACEMENT",
                options: [
                    ["顶部", "top"],
                    ["底部", "bottom"],
                    ["顶部左侧", "top-start"],
                    ["顶部右侧", "top-end"],
                    ["底部左侧", "bottom-start"],
                    ["底部右侧", "bottom-end"]
                ]
            },
            {
                type: "input_value",
                name: "ACTION",
                check: "String"
            },
        ],
        colour: "#6750A4",
        tooltip: "弹出一个 MDUI 提示",
        helpUrl: "",
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
    },
    {
        type: "mdui_switch",
        message0: "MDUI 开关 ",
        args0: [],
        colour: "#6750A4",
        tooltip: "添加一个 MDUI 开关",
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
        "--mdui-color-on-primary": "255, 255, 255",
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
        "--mdui-color-on-surface": "28, 27, 31",
        "--mdui-color-error": "244, 67, 54",
        "--mdui-typescale-label-large-size": "0.75rem",
        "--mdui-typescale-label-large-weight": "400",
        "--mdui-typescale-label-large-tracking": "0.01rem",
        "--mdui-typescale-label-large-line-height": "1.6rem",
        "--mdui-elevation-level0": "none",
        "--mdui-motion-duration-medium4": "400ms",
        "--mdui-motion-easing-emphasized-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1)",
        "--mdui-elevation-level3": "0 1.25px 5px 0 rgba(var(--mdui-color-shadow), 19%), 0 0.3333px 1.5px 0 rgba(var(--mdui-color-shadow), 3.9%)",
        "--mdui-color-inverse-surface": "49, 48, 51",
        "--mdui-color-inverse-on-surface": "244, 239, 244",
        "--mdui-typescale-body-medium-size": "0.875rem",
        "--mdui-typescale-body-medium-weight": "400",
        "--mdui-typescale-body-medium-tracking": "0.0155625em",
        "--mdui-typescale-body-medium-line-height": "1.25rem",
        "--mdui-color-inverse-primary": "240, 240, 240, 0.4",
        "--mdui-color-shadow": "0, 0, 0",
        "--mdui-color-outline": "121, 116, 126",
        "--mdui-color-on-surface-variant-light": "73, 69, 78",
        "--mdui-color-primary-container": "0 162 255",
        "--mdui-color-background": "200 240 255",
    };
    return `mduiTheme(${JSON.stringify(defaultTheme, null, 4)})`;
}

Blockly.JavaScript.forBlock["mdui_button"] = function (block) {
    const label = block.getFieldValue("LABEL");
    const fit = block.getFieldValue("FIT") == "TRUE" ? true : false;
    const disabled = block.getFieldValue("DISABLED") == "TRUE" ? true : false;
    const loading = block.getFieldValue("LOADING") == "TRUE" ? true : false;
    let attrs = "";
    if (fit) attrs += " full-width";
    if (disabled) attrs += " disabled";
    if (loading) attrs += " loading";
    return `<mdui-button${attrs}${handleAttrAndStyle(block)}">${label}</mdui-button>`;
}

Blockly.JavaScript.forBlock["mdui_text_field"] = function (block) {
    const label = block.getFieldValue("LABEL");
    const placeholder = block.getFieldValue("PLACEHOLDER");
    const helper = block.getFieldValue("HELPER");
    const value = block.getFieldValue("VALUE");
    const minlength = Blockly.JavaScript.valueToCode(block, "MIN_LENGTH", Blockly.JavaScript.ORDER_ATOMIC) || "";
    const maxlength = Blockly.JavaScript.valueToCode(block, "MAX_LENGTH", Blockly.JavaScript.ORDER_ATOMIC) || "";
    const type = block.getFieldValue("TYPE");
    const readonly = block.getFieldValue("READONLY") == "TRUE" ? true : false;
    const disabled = block.getFieldValue("DISABLED") == "TRUE" ? true : false;
    const counter = block.getFieldValue("COUNTER") == "TRUE" ? true : false;
    let attrs = "";
    if (disabled) attrs += " disabled";
    if (readonly) attrs += " readonly";
    if (label) attrs += ` label="${label}"`;
    if (placeholder) attrs += ` placeholder="${placeholder}"`;
    if (helper) attrs += ` helper="${helper}" helper-on-focus`;
    if (value) attrs += ` value="${value}"`;
    if (minlength != 0) attrs += ` minlength="${minlength}"`;
    if (maxlength != 0) attrs += ` maxlength="${maxlength}"`;
    if (counter) attrs += ` counter`;
    attrs += ` type="${type}"`;
    return `<mdui-text-field${attrs}></mdui-text-field>`;
}

Blockly.JavaScript.forBlock["mdui_snackbar"] = function (block) {
    const message = Blockly.JavaScript.valueToCode(block, "MESSAGE", Blockly.JavaScript.ORDER_ATOMIC) || "''";
    const placement = block.getFieldValue("PLACEMENT");
    const action = Blockly.JavaScript.valueToCode(block, "ACTION", Blockly.JavaScript.ORDER_ATOMIC);
    return `if (globalThis.mdui) {
    mdui.snackbar({
        message: ${message},
        placement: "${placement}",
        action: ${action},
    });
} else {
    console.warn("MDUI Snackbar: MDUI not loaded.");
}`;
};

Blockly.JavaScript.forBlock["mdui_switch"] = function (block) { 
    return `<mdui-switch></mdui-switch>`;
};