Blockly.Blocks['list_item'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("项目");
        this.setNextStatement(true, null);
        this.setPreviousStatement(true, null);
        this.setColour("#F9CC37");
        this.setTooltip('');
        this.setHelpUrl('');
        this.setInputsInline(true);
    }
};
Blockly.Extensions.registerMutator("array_craete_mutator", {
    itemCount_: 0,
    loadExtraState: function (state) {
        this.itemCount_ = state['itemCount'];
        this.updateShape_();
    },
    saveExtraState: function () {
        return {
            'itemCount': this.itemCount_,
        };
    },
    updateShape_: function () {
        if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY').appendField("空");
        }
        for (let i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('ADD' + i)) {
                console.log(i)
                const input = this.appendValueInput('ADD' + i).setAlign(Blockly.inputs.Align.RIGHT);
                console.log(input);
                input.connection.setShadowState({
                    type: "text",
                    fields: {
                        TEXT: 'value'
                    }
                });
                input.connection.targetConnection.setShadowState({
                    type: "text",
                    fields: {
                        TEXT: 'value'
                    }
                });
                console.log(input);
            }
        }
        for (let i = this.itemCount_; this.getInput('ADD' + i); i++) {
            this.removeInput('ADD' + i);
        }
    },
    mutationToDom: function () {
        const container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    domToMutation: function (xmlElement) {
        const items = xmlElement.getAttribute('items');
        if (!items) throw new TypeError('element did not have items');
        this.itemCount_ = parseInt(items, 10);
        this.updateShape_();
    },
    decompose: function (workspace) {
        const containerBlock = workspace.newBlock('lists_create_with_container');
        containerBlock.initSvg();
        containerBlock.setColour("#F9CC37");
        let connection = containerBlock.getInput('STACK').connection;
        for (let i = 0; i < this.itemCount_; i++) {
            const itemBlock = workspace.newBlock('lists_create_with_item');
            itemBlock.initSvg();
            itemBlock.setColour("#F9CC37");
            if (!itemBlock.previousConnection) {
                throw new Error('itemBlock has no previousConnection');
            }
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    compose: function (containerBlock) {
        let itemBlock = containerBlock.getInputTargetBlock('STACK');
        const connections = [];
        while (itemBlock) {
            if (itemBlock.isInsertionMarker()) {
                itemBlock = itemBlock.getNextBlock();
                continue;
            }
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.getNextBlock();
        }
        for (let i = 0; i < this.itemCount_; i++) {
            const connection = this.getInput('ADD' + i).connection.targetConnection;
            if (connection && !connections.includes(connection)) {
                connection.disconnect();
            }
        }
        this.itemCount_ = connections.length;
        this.updateShape_();
        for (let i = 0; i < this.itemCount_; i++) {
            connections[i]?.reconnect(this, 'ADD' + i);
        }
    },
    saveConnections: function (containerBlock) {
        containerBlock.setColour("#F9CC37");
        let itemBlock = containerBlock.getInputTargetBlock('STACK');
        let i = 0;
        while (itemBlock) {
            if (itemBlock.isInsertionMarker()) {
                itemBlock = itemBlock.getNextBlock();
                continue;
            }
            const input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input?.connection.targetConnection;
            itemBlock = itemBlock.getNextBlock();
            i++;
        }
    },
}, null, ["list_item"]);
var ArrayCreateJson = {
    type: 'array_create',
    message0: '数组',
    args0: [],
    output: 'Array',
    tooltip: '创建一个数组',
    mutator: 'array_craete_mutator',
    inputsInline: true,
    colour: '#F9CC37',
}
Blockly.Block["array_create"] = {
    init: function () {
        this.jsonInit(ArrayCreateJson);
        this.updateShape_();
        this.svgGroup_.classList.add('ArrayBlocks');
    }
}
Blockly.JavaScript.forBlock["array_create"] = function (block, generator) {
    var code;
    var inputs = "";
    for (var i = 0; i < block.itemCount_; i++) {
        var inputName = 'ADD' + i;
        var inputCode = Blockly.JavaScript.valueToCode(block, inputName, Blockly.JavaScript.ORDER_NONE) || null;
        inputs += inputCode + `${i == block.itemCount_ - 1 ? '' : ', '}`;
    }
    code = `[${inputs}]`;
    return code;
}
Blockly.Blocks["lists_create_with"] = {
    init: function () {
        this.jsonInit(ArrayCreateJson)
    }
};