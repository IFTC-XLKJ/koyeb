Blockly.defineBlocksWithJsonArray([
    {
        type: "add_event_listener",
        message0: "给 %1 添加 %2 事件 %3",
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
                type: "statement_input",
                name: "code",
            }
        ]
    },
])

Blockly.JavaScript.forBlock["add_event_listener"] = function (block) { 
};