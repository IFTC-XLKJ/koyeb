Blockly.defineBlocksWithJsonArray([
    {
        type: "vv_dragger",
        message0: "拖拽器 元素选择器%1",
        args0: [
            {
                type: "input_value",
                name: "selector",
            }
        ],
        output: "String",
        colour: "#449CD6",
        tooltip: "拖拽器",
        helpUrl: "",
        inputsInline: true,
    }
]);

Blockly.JavaScript.forBlock["vv_dragger"] = function (block) {
    var selector = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_ATOMIC) || "''";
    var code = `new Dragger(${selector})`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
}