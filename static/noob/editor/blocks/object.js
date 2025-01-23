Blockly.defineBlocksWithJsonArray([
    {
        type: "element_dict",
        message0: "字典",
        colour: 160,
        tooltip: "创建一个字典",
        helpUrl: "",
        output: "Dictionary",
        inputsInline: false,
        mutator: "dict_mutator"
    }
]);

Blockly.Blocks['dict_mutator'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("字典项");
        this.appendStatementInput("STACK");
        this.setColour(160);
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
                if (!this.getInput('ADD' + i)) {
                    this.appendValueInput('ADD' + i)
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField('项');
                }
            }
            while (this.getInput('ADD' + i)) {
                this.removeInput('ADD' + i);
                i++;
            }
        }
    }
};

Blockly.Extensions.registerMutator('dict_mutator', Blockly.Constants.Dictionary.MUTATOR_MIXIN, null, ['dict_item']);

Blockly.defineBlocksWithJsonArray([
    {
        type: "dict_item",
        message0: "项",
        previousStatement: null,
        nextStatement: null,
        colour: 160,
        tooltip: "字典项",
        helpUrl: ""
    }
]);

Blockly.JavaScript['element_dict'] = function (block) {
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

Blockly.JavaScript['dict_item'] = function (block) {
    var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return key + ': ' + value;
};