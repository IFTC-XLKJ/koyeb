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
        type: "style_background_color",
        message0: '背景颜色 %1',
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
        type: "style_font_size",
        message0: '字体大小 %1',
        args0: [
            {
                type: 'field_input',
                name: 'SIZE',
                text: '16px'
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
        type: "style_border",
        message0: '边框 宽度 %1 样式 %2 颜色 %3',
        args0: [
            {
                type: 'field_input',
                name: 'BORDER',
                text: '1px'
            },
            {
                type: 'field_dropdown',
                name: 'STYLE',
                options: [
                    ["none","无边框"],
                    ["hidden","隐藏边框"],
                    ["dotted","点线边框"],
                    ["dashed","虚线边框"],
                    ["solid","实线边框"],
                    ["double","双线边框"],
                    ["groove","3D凹槽边框"],
                    ["ridge","3D垄状边框"],
                    ["inset","3D内嵌边框"],
                    ["outset","3D外凸边框"]
                ]
            },
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
    }
]);

Blockly.JavaScript.forBlock['style_border'] = function (block) {
    var border = block.getFieldValue('BORDER');
    var style = block.getFieldValue('STYLE');
    var color = block.getFieldValue('COLOR');
    return `border: ${border} ${style} ${color};\n`;
};

Blockly.JavaScript.forBlock['style_font_size'] = function (block) {
    var size = block.getFieldValue('SIZE');
    return `font-size: ${size};\n`;
};

Blockly.JavaScript.forBlock['style_background_color'] = function (block) {
    var color = block.getFieldValue('COLOR');
    return `background-color: ${color};\n`;
};

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