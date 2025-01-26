Blockly.defineBlocksWithJsonArray([
    {
        type: "attr_get",
        message0: "属性 %1",
        args0: [
            {
                type: "field_dropdown",
                name: "ATTRIBUTE",
                options: [
                    ["类名", "class"],
                    ["ID", "id"],
                    ["备用文本", "alt"],
                    ["标题", "title"],
                    ["目标", "target"],
                    ["类型", "type"],
                    ["提示词", "placeholder"],
                    ["值", "value"],
                    ["名称", "name"],
                    ["宽度", "width"],
                    ["高度", "height"],
                    ["链接", "href"],
                ]
            }
        ],
        colour: 120,
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
        colour: 120,
        output: "AttrString",
        tooltip: "自定义属性",
        helpUrl: "",
        inputInline: true,
    },
    {
        type: "attr_target_value",
        message0: "目标 属性值 %1",
        args0: [
            {
                type: "fields_dropdown",
                name: "ATTRIBUTE",
                options: [
                    ["当前窗口/框架目标", "_self"],
                    ["新窗口/新标签页目标", "_blank"],
                    ["父框架集目标", "_parent"],
                    ["顶级窗口目标", "_top"],
                ]
            }
        ],
        colour: 120,
        output: "AttrString",
        tooltip: "目标 属性值",
        helpUrl: "",
        inputInline: true,
    }
])
Blockly.JavaScript.forBlock["attr_get"] = function (block) {
    var code = `"${block.getFieldValue("ATTRIBUTE")}"`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
}
Blockly.JavaScript.forBlock["attr_data_get"] = function (block) {
    var code = `"data-${block.getFieldValue("ATTRIBUTE")}"`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
}
Blockly.JavaScript.forBlock["attr_target_value"] = function (block) {
    var code = `"${block.getFieldValue("ATTRIBUTE")}"`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
}

console.log("attribute.js 加载完成")