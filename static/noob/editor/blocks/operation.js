Blockly.defineBlocksWithJsonArray([
    {
        type: "math_number",
        message0: "%1",
        args0: [
            {
                type: "field_number",
                name: "NUM",
                value: 0
            }
        ],
        output: "Number",
        colour: 20,
        tooltip: "数字",
        helpUrl: ""
    },
    {
        type: "text",
        message0: "%1",
        args0: [
            {
                type: "field_input",
                name: "TEXT",
                text: ""
            }
        ],
        output: "String",
        colour: 20,
        tooltip: "文本",
        helpUrl: ""
    },
]);