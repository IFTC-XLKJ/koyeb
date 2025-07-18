const eventNames = [
    ["点击", "click"],
    ["鼠标右键/触摸屏长按", "contextmenu"],
    ["鼠标移入", "mouseover"],
    ["鼠标移出", "mouseout"],
    ["鼠标移动", "mousemove"],
    ["鼠标按下", "mousedown"],
    ["鼠标抬起", "mouseup"],
    ["鼠标滚轮", "wheel"],
    ["触摸屏按下", "touchstart"],
    ["触摸屏抬起", "touchend"],
    ["触摸屏移动", "touchmove"],
    ["键盘按下", "keydown"],
    ["键盘抬起", "keyup"],
    ["键盘输入", "keypress"],
    ["加载", "load"],
    ["DOM加载完毕", "DOMContentLoaded"],
    ["发生错误", "error"],
    ["窗口改变", "resize"],
];

Blockly.defineBlocksWithJsonArray([
    {
        type: "add_event_listener",
        message0: "给 %1 添加 %2 事件 函数 %3",
        args0: [
            {
                type: "input_value",
                name: "element",
                check: "Dictionary"
            },
            {
                type: "field_dropdown",
                name: "eventName",
                options: eventNames
            },
            {
                type: "input_value",
                name: "func",
                check: "Function"
            }
        ],
        colour: "#608FEE",
        tooltip: "绑定事件",
        helpUrl: "",
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
    },
    {
        type: "remove_event_listener",
        message0: "把 %1 的 %2 事件移除 函数 %3",
        args0: [
            {
                type: "input_value",
                name: "element",
                check: "Dictionary",
            },
            {
                type: "field_dropdown",
                name: "event",
                options: eventNames,
            },
            {
                type: "input_value",
                name: "func",
                check: "Function",
            },
        ],
        colour: "#608FEE",
        tooltip: "移除事件",
        helpUrl: "",
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
    },
    {
        type: "prevent_default",
        message0: "%1 阻止默认行为",
        args0: [
            {
                type: "input_value",
                name: "event",
                check: "Dictionary",
            },
        ],
        colour: "#608FEE",
        tooltip: "",
        helpUrl: "",
        inputsInline: true,
        nextStatement: null,
        previousStatement: null,
    },
    {
        type: "event_var",
        message0: "事件变量",
        args0: [],
        colour: "#608FEE",
        tooltip: "",
        helpUrl: "",
        inputsInline: true,
        output: "Dictionary",
    },
])

Blockly.JavaScript.forBlock["add_event_listener"] = function (block) {
    const element = Blockly.JavaScript.valueToCode(block, "element", Blockly.JavaScript.ORDER_ATOMIC);
    console.log(element[Symbol.toStringTag])
    const eventName = block.getFieldValue("eventName");
    const func = Blockly.JavaScript.valueToCode(block, "func", Blockly.JavaScript.ORDER_ATOMIC);
    return `${removeExtraParentheses(element)}.addEventListener("${eventName}", ${func});\n`;
};

Blockly.JavaScript.forBlock["remove_event_listener"] = function (block) {
    const element = Blockly.JavaScript.valueToCode(block, "element", Blockly.JavaScript.ORDER_ATOMIC);
    const eventName = block.getFieldValue("eventName");
    const func = Blockly.JavaScript.valueToCode(block, "func", Blockly.JavaScript.ORDER_ATOMIC);
    return `${removeExtraParentheses(element)}.removeEventListener("${eventName}", ${func});\n`;
};

Blockly.JavaScript.forBlock["prevent_default"] = function (block) {
    const event = Blockly.JavaScript.valueToCode(block, "event", Blockly.JavaScript.ORDER_ATOMIC);
    return `${event}.preventDefault();\n`;
};

Blockly.JavaScript.forBlock["event_var"] = function (block) {
    return [`(new Event("event", { details: {}}))`, Blockly.JavaScript.ORDER_NONE];
};
function removeExtraParentheses(code) {
    let newCode = code;
    if (code.startsWith("(") && code.endsWith(")")) {
        newCode = code.slice(1, -1);
    }
    if (newCode.startsWith("(") && newCode.endsWith(")")) {
        return removeExtraParentheses(newCode);
    }
    return newCode;
}