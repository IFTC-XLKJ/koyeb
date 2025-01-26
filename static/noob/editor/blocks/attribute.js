Blockly.defineBlocksWithJsonArray([
    {
        type: "attr_get",
        message0: "属性 %1",
        args0: [
            {
                type: "field_dropdown",
                name: "ATTRIBUTE",
                options: [
                    ["class", "class"],
                    ["id", "id"],
                    ["alt", "alt"],
                    ["title", "title"],
                    ["target", "target"],
                    ["type", "type"],
                    ["value", "value"],
                ]
            }
        ],
        colour: 230,
        output: "AttrString",
        tooltip: "属性",
        helpUrl: "",
        inputInline: true,
    },
    {
        type: "attr_data_get",
        message0: "自定义属性 %1",
        args0: [
            {
                type: "field_input",
                name: "ATTRIBUTE",
                text: "xxx"
            }
        ],
        colour: 230,
        output: "AttrString",
        tooltip: "自定义属性",
        helpUrl: "",
        inputInline: true,
    },
])
Blockly.JavaScript.forBlock["attr_get"] = function (block) {
    var code = `"${block.getFieldValue("ATTRIBUTE")}"`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
}
Blockly.JavaScript.forBlock["attr_data_get"] = function (block) {
    var code = `"data-${block.getFieldValue("ATTRIBUTE")}"`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
}