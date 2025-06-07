Blockly.defineBlocksWithJsonArray([
    {
        type: "get_document",
        message0: "获取文档",
        colour: "#9C004B",
        tooltip: "获取文档",
        helpUrl: "",
        output: "Dictionary",
    },
    {
        type: "get_document_element",
        message0: "获取元素 %1",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "获取元素",
        helpUrl: "",
        output: "Dictionary",
        inputsInline: true
    },
    {
        type: "get_document_elements",
        message0: "获取元素列表 %1",
        args0: [
            {
                type: "input_value",
                name: "ELEMENT",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "获取元素列表",
        helpUrl: "",
        output: "Array",
        inputsInline: true
    },
    {
        type: "get_document_element_by_id",
        message0: "获取通过ID元素 %1",
        args0: [
            {
                type: "input_value",
                name: "ID",
                check: "String"
            }
        ],
        colour: "#9C004B",
        tooltip: "获取通过ID元素",
        helpUrl: "",
        output: "Dictionary",
        inputsInline: true
    }
])
Blockly.JavaScript.forBlock['get_document'] = function (block) {
    var code = 'document';
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['get_document_element'] = function (block) {
    var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `document.getElementById(${element})`;
    return [code, Blockly.JavaScript.ORDER_NONE];
}
Blockly.JavaScript.forBlock['get_document_elements'] = function (block) {
    var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `document.getElementsByClassName(${element})`;
    return [code, Blockly.JavaScript.ORDER_NONE];
}