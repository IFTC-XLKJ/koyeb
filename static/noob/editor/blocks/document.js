Blockly.defineBlocksWithJsonArray([
    {
        type: "get_document",
        message0: "获取文档",
        output: "Dictionary",
        colour: "#F8AA87",
        tooltip: "获取文档",
        helpUrl: ""
    }
])
Blockly.JavaScript['get_document'] = function (block) {
    var code = 'document';
    return [code, Blockly.JavaScript.ORDER_NONE];
}