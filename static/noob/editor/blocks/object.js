// 字典
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_dict",
        message0: "字典",
        colour: 160,
        tooltip: "创建一个字典（键值对）",
        helpUrl: "",
        output: "Dictionary",
        inputsInline: false,
        mutator: "dict_mutator"
    }
]);

Blockly.JavaScript.forBlock['element_dict'] = function (block) {
    var code = '{\n';
    var keys = block.getFieldValue('KEYS').split(',');
    var values = block.getFieldValue('VALUES').split(',');
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] && values[i]) {
            code += `    "${keys[i]}": "${values[i]}",\n`;
        }
    }
    code = code.slice(0, -2) + '\n}'; // Remove the last comma and newline
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Extensions.registerMutator('dict_mutator', {
    blockMutator: true,
    initMutator: function () {
        this.keys_ = [];
        this.values_ = [];
        this.keyConnections_ = [];
        this.valueConnections_ = [];
    },
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var keys = this.keys_.map(function (key) { return key.value; }).join(',');
        var values = this.values_.map(function (value) { return value.value; }).join(',');
        container.setAttribute('keys', keys);
        container.setAttribute('values', values);
        return container;
    },
    domToMutation: function (xmlElement) {
        this.keys_ = [];
        this.values_ = [];
        var keys = xmlElement.getAttribute('keys').split(',');
        var values = xmlElement.getAttribute('values').split(',');
        for (var i = 0; i < keys.length; i++) {
            this.keys_.push({ value: keys[i] });
            this.values_.push({ value: values[i] });
        }
        this.rebuildShape_();
    },
    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('dict_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.keys_.length; i++) {
            var itemBlock = workspace.newBlock('dict_item');
            itemBlock.setFieldValue(this.keys_[i].value, 'KEY');
            itemBlock.setFieldValue(this.values_[i].value, 'VALUE');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    compose: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        this.keys_ = [];
        this.values_ = [];
        while (itemBlock) {
            this.keys_.push({ value: itemBlock.getFieldValue('KEY') });
            this.values_.push({ value: itemBlock.getFieldValue('VALUE') });
            itemBlock = itemBlock.getNextBlock();
        }
        this.rebuildShape_();
    },
    saveConnections: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var i = 0;
        while (itemBlock) {
            this.keyConnections_[i] = itemBlock.valueConnection_;
            this.valueConnections_[i] = itemBlock.statementConnection_;
            i++;
            itemBlock = itemBlock.getNextBlock();
        }
    },
    rebuildShape_: function () {
        for (var i = 0; i < this.keyConnections_.length; i++) {
            this.keyConnections_[i].disconnect();
            this.valueConnections_[i].disconnect();
        }
        this.keyConnections_ = [];
        this.valueConnections_ = [];
        this.removeInput('KEYS');
        this.removeInput('VALUES');
        this.appendDummyInput('KEYS')
            .appendField('Keys')
            .appendField(new Blockly.FieldTextInput(this.keys_.map(function (key) { return key.value; }).join(',')), 'KEYS');
        this.appendDummyInput('VALUES')
            .appendField('Values')
            .appendField(new Blockly.FieldTextInput(this.values_.map(function (value) { return value.value; }).join(',')), 'VALUES');
        for (var i = 0; i < this.keys_.length; i++) {
            var input = this.appendValueInput('KEY' + i)
                .setCheck('String');
            var input2 = this.appendValueInput('VALUE' + i);
            this.keyConnections_.push(input.connection);
            this.valueConnections_.push(input2.connection);
        }
    }
});

Blockly.Blocks['dict_container'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('字典项');
        this.appendStatementInput('STACK');
        this.setColour(160);
        this.setTooltip('字典项容器');
        this.contextMenu = false;
    }
};

Blockly.Blocks['dict_item'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('键')
            .appendField(new Blockly.FieldTextInput('key'), 'KEY')
            .appendField('值')
            .appendField(new Blockly.FieldTextInput('value'), 'VALUE');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('字典项');
        this.contextMenu = false;
    }
};