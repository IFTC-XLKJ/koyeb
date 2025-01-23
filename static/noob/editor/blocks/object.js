Blockly.defineBlocksWithJsonArray([
    {
        type: "element_dict",
        message0: "字典",
        colour: 290,
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
            .appendField("字典项");
        this.appendStatementInput("STACK");
        this.setColour(290); // 紫色
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
        if (this.itemCount_ && this.itemCount_ > 0) {
            for (var i = 0; i < this.itemCount_; i++) {
                if (!this.getInput('ADD' + i + '_KEY')) {
                    this.appendValueInput('ADD' + i + '_KEY')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField('键');
                }
                if (!this.getInput('ADD' + i + '_VALUE')) {
                    this.appendValueInput('ADD' + i + '_VALUE')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField('值');
                }
            }
            while (this.getInput('ADD' + i + '_KEY')) {
                this.removeInput('ADD' + i + '_KEY');
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
        message0: "键 %1 值 %2",
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
        colour: 290,
        tooltip: "字典项",
        helpUrl: "",
        inputsInline: true
    }
]);

Blockly.JavaScript.forBlock['element_dict'] = function (block) {
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