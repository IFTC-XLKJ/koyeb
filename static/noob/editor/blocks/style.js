Blockly.defineBlocksWithJsonArray([
    {
        type: 'style_selector',
        message0: '%1',
        args0: [
            {
                type: 'field_input',
                name: 'SELECTOR',
                text: 'div'
            }
        ],
        output: 'StyleSelector',
        colour: 230,
        tooltip: '',
        helpUrl: '',
        inputsInline: true
    },
    {
        type: 'style_group',
        message0: '元素选择器 %1 %2',
        args0: [
            {
                type: 'input_value',
                name: 'STYLE',
                check: 'StyleSelector',
            },
            {
                type: 'input_statement',
                name: 'STYLE_GROUP'
            }
        ],
        colour: 230,
        tooltip: '',
        helpUrl: '',
        nextStatement: true,
        previousStatement: true,
    },
    {
        type: "style_color",
        message0: '颜色 %1',
        args0: [
            {
                type: 'field_input',
                name: 'COLOR',
                text: '#000000'
            }
        ],
        colour: 230,
        tooltip: '',
        helpUrl: '',
        inputsInline: true,
        nextStatement: true,
        previousStatement: true,
    },
    {
        type: "style_background",
        message0: '背景%1',
    }
]);

Blockly.JavaScript.forBlock['style_color'] = function (block) {
    var color = block.getFieldValue('COLOR');
    return `color: ${color};\n`;
};

Blockly.JavaScript.forBlock['style_group'] = function (block) {
    var style = Blockly.JavaScript.valueToCode(block, 'STYLE', Blockly.JavaScript.ORDER_ATOMIC);
    var style_group = Blockly.JavaScript.statementToCode(block, 'STYLE_GROUP');
    return style + ' {' + style_group + '}';
};

Blockly.JavaScript.forBlock['style_selector'] = function (block) {
    var selector = block.getFieldValue('SELECTOR');
    return [selector, Blockly.JavaScript.ORDER_ATOMIC];
};