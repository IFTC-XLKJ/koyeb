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
                    ["click", "click"],
                    ["mouseover", "mouseover"],
                    ["mouseout", "mouseout"],
                    ["mousemove", "mousemove"],
                    ["mousedown", "mousedown"],
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
};