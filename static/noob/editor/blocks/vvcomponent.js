Blockly.defineBlocksWithJsonArray([
    {
        type: "vv_dragger",
        message0: "拖拽器 元素选择器%1",
        args0: [
            {
                type: "input_value",
                name: "selector",
                check: "String"
            }
        ],
        output: "Dictionary",
        tooltip: "拖拽器",
        colour: "#68CDFF",
        inputsInline: true,
    }
]);

Blockly.JavaScript.forBlock["vv_dragger"] = function (block) {
    const selector = Blockly.JavaScript.valueToCode(block, "selector", Blockly.JavaScript.ORDER_ATOMIC);
    if (!selector) {
        throw new Error("Selector is required for the dragger block.");
    }
    return [`(new Dragger(document.querySelector(${selector})))`, Blockly.JavaScript.ORDER_ATOMIC];
}