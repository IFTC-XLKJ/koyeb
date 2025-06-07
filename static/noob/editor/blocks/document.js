Blockly.defineBlocksWithJsonArray([
    {
        type: "get_document",
        message0: "获取文档",
        colour: "#9C004B",
        tooltip: "获取文档",
        helpUrl: "",
        output: "Dictionary",
    }
])
Blockly.JavaScript.forBlock['get_document'] = function (block) {
    var code = 'document';
    return [code, Blockly.JavaScript.ORDER_NONE];
}