const ARRAY_COLOR = "#F9CC37";

Blockly.Blocks['list_item'] = {
    init() {
        this.appendDummyInput().appendField("项目");
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        this.setColour(ARRAY_COLOR);
        this.setTooltip('')
        this.setInputsInline(true);
    }
};

Blockly.Blocks['lists_create_with_container'] = {
    init() {
        this.appendDummyInput()
            .appendField('数组');
        this.appendStatementInput('STACK')
            .appendField('');
        this.setColour(ARRAY_COLOR);
    }
};

Blockly.Blocks['lists_create_with_item'] = {
    init() {
        this.appendValueInput('ADD')
            .appendField('');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(ARRAY_COLOR);
    }
};

Blockly.Extensions.registerMutator('array_create_mutator', {
    itemCount_: 0,
    loadExtraState(state) {
        this.itemCount_ = state.itemCount;
        this.updateShape_();
    },
    saveExtraState() {
        return { itemCount: this.itemCount_ };
    },
    updateShape_() {
        if (this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        }
        if (!this.itemCount_) {
            this.appendDummyInput('EMPTY').appendField("空");
        }
        this.updateInputs();
    },

    updateInputs() {
        if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY').appendField(
                Msg['LISTS_CREATE_EMPTY_TITLE'],
            );
        }
        for (let i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('ADD' + i)) {
                const input = this.appendValueInput('ADD' + i).setAlign(Align.RIGHT);
                if (i === 0) {
                    input.appendField(Msg['LISTS_CREATE_WITH_INPUT_WITH']);
                }
            }
        }
        for (let i = this.itemCount_; this.getInput('ADD' + i); i++) {
            this.removeInput('ADD' + i);
        }
    },
    mutationToDom() {
        const xmlUtils = Blockly.utils.xml;
        const container = xmlUtils.createElement('mutation');
        container.setAttribute('items', String(this.itemCount_));
        return container;
    },
    domToMutation(xml) {
        const items = xml.getAttribute('items');
        if (!items) throw new TypeError('element did not have items');
        this.itemCount_ = parseInt(items, 10);
        this.updateShape_();
    },
    decompose(workspace) {
        const containerBlock = workspace.newBlock('lists_create_with_container');
        containerBlock.initSvg();
        let connection = containerBlock.getInput('STACK').connection;
        for (let i = 0; i < this.itemCount_; i++) {
            const itemBlock = workspace.newBlock('lists_create_with_item');
            itemBlock.initSvg();
            if (!itemBlock.previousConnection) {
                throw new Error('itemBlock has no previousConnection');
            }
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    compose(containerBlock) {
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
    }
}, null, ['list_item']);

const arrayCreateConfig = {
    type: 'array_create',
    message0: '数组',
    output: 'Array',
    tooltip: '创建一个数组',
    mutator: 'array_create_mutator',
    colour: ARRAY_COLOR,
    inputsInline: true
};

Blockly.Blocks['array_create'] = {
    init() {
        this.jsonInit(arrayCreateConfig);
        this.updateShape_();
    },

    render() {
        Blockly.Block.prototype.render.call(this);
        if (this.svgGroup_) {
            this.svgGroup_.classList.add('ArrayBlocks');
        }
    }
};

Blockly.JavaScript.forBlock['array_create'] = (block) => {
    const elements = [];
    for (let i = 0; i < block.itemCount_; i++) {
        const code = Blockly.JavaScript.valueToCode(block, `ADD${i}`, Blockly.JavaScript.ORDER_NONE) || 'null';
        elements.push(code);
    }

    return [`[${elements.join(', ')}]`, Blockly.JavaScript.ORDER_ATOMIC];
};