Blockly.defineBlocksWithJsonArray([
    {
        type: "object_dict",
        message0: "字典",
        colour: "#9F73FE",
        tooltip: "创建一个字典",
        helpUrl: "",
        output: "Dictionary",
        inputsInline: true,
        mutator: "dict_mutator"
    }
]);

Blockly.Blocks['dict_mutator'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("字典");
        this.appendStatementInput("STACK");
        this.setColour("#9F73FE");
        this.setTooltip("添加或移除字典项");
        this.setHelpUrl("");
    }
};

if (!Blockly.Constants) {
    Blockly.Constants = {};
}

Blockly.Constants.Dictionary = {};

Blockly.Constants.Dictionary.MUTATOR_MIXIN = {
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var itemCount = this.itemCount_;
        container.setAttribute('items', itemCount);
        return container;
    },
    domToMutation: function (xmlElement) {
        var itemCount = parseInt(xmlElement.getAttribute('items'), 10);
        this.itemCount_ = itemCount;
        this.updateShape_();
    },
    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('dict_mutator');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('dict_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    compose: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var connections = [];
        while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
        this.itemCount_ = connections.length;
        this.updateShape_();
    },
    saveConnections: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
            i++;
        }
    },
    updateShape_: function () {
        console.log('updateShape_ called with itemCount_:', this.itemCount_);
        if (this.itemCount_ && this.itemCount_ > 0) {
            for (var i = 0; i < this.itemCount_; i++) {
                if (!this.getInput('ADD' + i + '_KEY')) {
                    var input = this.appendValueInput('ADD' + i + '_KEY')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField('键:');
                    var shadowBlock = Blockly.utils.xml.createElement('shadow');
                    shadowBlock.setAttribute('type', 'text');
                    var field = Blockly.utils.xml.createElement('field');
                    field.setAttribute('name', 'TEXT');
                    field.appendChild(document.createTextNode('key'));
                    shadowBlock.appendChild(field);
                    input.connection.setShadowDom(shadowBlock);
                }
                if (!this.getInput('ADD' + i + '_VALUE')) {
                    var input = this.appendValueInput('ADD' + i + '_VALUE')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField('值:');
                    var shadowBlock = Blockly.utils.xml.createElement('shadow');
                    shadowBlock.setAttribute('type', 'text');
                    var field = Blockly.utils.xml.createElement('field');
                    field.setAttribute('name', 'TEXT');
                    field.appendChild(document.createTextNode('value'));
                    shadowBlock.appendChild(field);
                    input.connection.setShadowDom(shadowBlock);
                }
            }
            var inputsToRemove = [];
            for (var i = this.itemCount_; this.getInput('ADD' + i + '_KEY'); i++) {
                inputsToRemove.push('ADD' + i + '_KEY');
                inputsToRemove.push('ADD' + i + '_VALUE');
            }
            console.log('Inputs to remove:', inputsToRemove);
            for (var i = 0; i < inputsToRemove.length; i++) {
                console.log('Removing input:', inputsToRemove[i]);
                this.removeInput(inputsToRemove[i]);
            }
        } else {
            var i = 0;
            while (this.getInput('ADD' + i + '_KEY')) {
                console.log('Removing input: ADD' + i + '_KEY');
                this.removeInput('ADD' + i + '_KEY');
                console.log('Removing input: ADD' + i + '_VALUE');
                this.removeInput('ADD' + i + '_VALUE');
                i++;
            }
        }
    }
};

Blockly.Extensions.registerMutator('dict_mutator', Blockly.Constants.Dictionary.MUTATOR_MIXIN, null, ['dict_item']);

Blockly.defineBlocksWithJsonArray([
    {
        type: "dict_item",
        message0: "键:%1 值:%2",
        args0: [
            {
                type: "input_value",
                name: "KEY"
            },
            {
                type: "input_value",
                name: "VALUE"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#9F73FE",
        tooltip: "字典键值对",
        helpUrl: "",
        inputsInline: true
    }
]);

Blockly.JavaScript.forBlock['object_dict'] = function (block) {
    var code = '{';
    for (var i = 0; i < block.itemCount_; i++) {
        var key = Blockly.JavaScript.valueToCode(block, 'ADD' + i + '_KEY', Blockly.JavaScript.ORDER_ATOMIC);
        var value = Blockly.JavaScript.valueToCode(block, 'ADD' + i + '_VALUE', Blockly.JavaScript.ORDER_ATOMIC);
        code += key + ': ' + value;
        if (i < block.itemCount_ - 1) {
            code += ', ';
        }
    }
    code += '}';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['dict_item'] = function (block) {
    var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return key + ': ' + value;
};

Blockly.defineBlocksWithJsonArray([
    {
        type: "dict_get",
        message0: "字典 %1 获取 %2",
        args0: [
            {
                type: "input_value",
                name: "DICT",
                check: "Dictionary"
            },
            {
                type: "input_value",
                name: "KEY"
            }
        ],
        output: "Any",
        colour: "#9F73FE",
        tooltip: "获取字典中的值",
        inputsInline: true
    }
])
Blockly.JavaScript.forBlock['dict_get'] = function (block) {
    var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC);
    var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
    return [dict + '[' + key + ']', Blockly.JavaScript.ORDER_ATOMIC];
}
Blockly.defineBlocksWithJsonArray([
    {
        type: "dict_set",
        message0: "字典 %1 设置 %2 为 %3",
        args0: [
            {
                type: "input_value",
                name: "DICT",
                check: "Dictionary"
            },
            {
                type: "input_value",
                name: "KEY"
            },
            {
                type: "input_value",
                name: "VALUE"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: "#9F73FE",
        tooltip: "设置字典中的值",
        inputsInline: true
    }
])
Blockly.JavaScript.forBlock['dict_set'] = function (block) {
    var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC);
    var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return dict + '[' + key + '] = ' + value + ';\n';
}
Blockly.defineBlocksWithJsonArray([
    {
        type: "dict_del",
        message0: "字典 %1 删除 %2",
        args0: [
            {
                type: "input_value",
                name: "DICT",
                check: "Dictionary"
            },
            {
                type: "input_value",
                name: "KEY"
            }
        ],
        previousStatement: null,
    }
])

Blockly.defineBlocksWithJsonArray([
    {
        type: "dict_parse_string",
        message0: "字典 将字符串 %1 解析为对象",
        args0: [
            {
                type: "input_value",
                name: "DICT",
                check: "String"
            }
        ],
        output: "Object",
        colour: "#9F73FE",
        tooltip: "将字典解析为对象",
        inputsInline: true
    },
    {
        type: "dict_parse_object",
        message0: "字典 将对象 %1 解析为字符串",
        args0: [
            {
                type: "input_value",
                name: "DICT",
                check: "Dictionary"
            }
        ],
        output: "String",
        colour: "#9F73FE",
        tooltip: "将字典解析为字符串",
        inputsInline:true
    }
])
Blockly.JavaScript.forBlock['dict_parse_string'] = function (block) {
    var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC);
    dict = replaceFirstAndLastChar(dict, "'", "'");
    return ['JSON.parse(' + dict + ')', Blockly.JavaScript.ORDER_ATOMIC];
}
Blockly.JavaScript.forBlock['dict_parse_object'] = function (block) {
    var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC);
    return ['JSON.stringify(' + dict + ')', Blockly.JavaScript.ORDER_ATOMIC];
}