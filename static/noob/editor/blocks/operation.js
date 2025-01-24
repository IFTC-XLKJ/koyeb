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
        message0: "“%1”",
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
    {
        type: "text_join",
        message0: "%1 + %2",
        args0: [
            {
                type: "input_value",
                name: "ADD0",
            },
            {
                type: "input_value",
                name: "ADD1",
            }
        ],
        output: "String",
        colour: 20,
    }
]);
Blockly.JavaScript.forBlock['text'] = function (block) {
    var text = block.getFieldValue('TEXT');
    return ['"' + text + '"', Blockly.JavaScript.ORDER_ATOMIC];
}