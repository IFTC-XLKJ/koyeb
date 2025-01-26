Blockly.defineBlocksWithJson([
    {
        type: "attr_get",
        message0: "%1",
        args0: [
            {
                type: "field_dropdown",
                name: "ATTRIBUTE",
                options: [
                    ["class", "class"],
                    ["id", "id"],
                    ["style", "style"],
                    ["src", "src"],
                    ["href", "href"],
                    ["alt", "alt"],
                    ["title", "title"],
                    ["target", "target"],
                    ["type", "type"],
                    ["value", "value"],
                ]
            }
        ]
    }
])
Blockly.JavaScript.forBlock["attr_get"] = function (block) {
    return [`${block.getFieldValue("ATTRIBUTE")}`, Blockly.JavaScript.ORDER_NONE]
}