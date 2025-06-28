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
                options: [
                    ["点击", "click"],
                    ["mouseover", "mouseover"],
                    ["mouseout", "mouseout"],
                    ["mousemove", "mousemove"],
                    ["mousedown", "mousedown"],
                    ["load", "load"]
                ]
            },
            {
                type: "input_value",
                name: "func",
            }
        ],
        colour: "#608FEE",
        tooltip: "绑定事件",
        helpUrl: "",
        nextStatement: null,
        previousStatement: null,
    },
])

Blockly.JavaScript.forBlock["add_event_listener"] = function (block) { 
    const element = Blockly.JavaScript.valueToCode(block, "element", Blockly.JavaScript.ORDER_ATOMIC);
    const eventName = Blockly.JavaScript.valueToCode(block, "eventName", Blockly.JavaScript.ORDER_ATOMIC);
    const func = Blockly.JavaScript.valueToCode(block, "func", Blockly.JavaScript.ORDER_ATOMIC);
    return `${element}.addEventListener("${eventName}", ${func});\n`;
};