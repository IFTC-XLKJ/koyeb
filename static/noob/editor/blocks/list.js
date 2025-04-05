// Define color constant
const ARRAY_COLOR = "#F9CC37";

// Block for list items
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

// Mutator extension for array creation
Blockly.Extensions.registerMutator('array_create_mutator', {
    itemCount_: 0,

    loadExtraState(state) {
        this.itemCount_ = state.itemCount;
        this.updateShape();
    },

    saveExtraState() {
        return { itemCount: this.itemCount_ };
    },

    updateShape() {
        this.removeInput('EMPTY');

        if (!this.itemCount_) {
            this.appendDummyInput('EMPTY').appendField("空");
        }

        this.updateInputs();
    },

    updateInputs() {
        const existingInputs = this.getInputIds().filter(id => id.startsWith('ADD'));

        // Remove excess inputs
        existingInputs.slice(this.itemCount_).forEach(id => this.removeInput(id));

        // Add missing inputs
        for (let i = existingInputs.length; i < this.itemCount_; i++) {
            this.appendValueInput(`ADD${i}`)
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(`项目 ${i + 1}`)
                .setCheck(null);
        }
    },

    mutationToDom() {
        const container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },

    domToMutation(xml) {
        this.itemCount_ = parseInt(xml.getAttribute('items')) || 0;
        this.updateShape();
    },

    decompose(workspace) {
        const container = workspace.newBlock('lists_create_with_container');
        container.setColour(ARRAY_COLOR);

        let connection = container.getInput('STACK').connection;

        for (let i = 0; i < this.itemCount_; i++) {
            const itemBlock = workspace.newBlock('lists_create_with_item');
            itemBlock.setColour(ARRAY_COLOR);
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }

        return container;
    },

    compose(containerBlock) {
        const connections = [];

        let itemBlock = containerBlock.getInputTargetBlock('STACK');
        while (itemBlock) {
            if (itemBlock.isInsertionMarker()) {
                itemBlock = itemBlock.getNextBlock();
                continue;
            }

            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.getNextBlock();
        }

        this.itemCount_ = connections.length;
        this.updateShape();

        connections.forEach((conn, i) => conn?.reconnect(this, `ADD${i}`));
    }
}, null, ['list_item']);

// Array creation block definition
const arrayCreateConfig = {
    type: 'array_create',
    message0: '数组',
    output: 'Array',
    tooltip: '创建一个数组',
    mutator: 'array_create_mutator',
    colour: ARRAY_COLOR
};

Blockly.Blocks['array_create'] = {
    init() {
        this.jsonInit(arrayCreateConfig);
        this.updateShape();
        this.svgGroup_.classList.add('ArrayBlocks');
    }
};

// JS code generator
Blockly.JavaScript['array_create'] = (block) => {
    const elements = [];
    for (let i = 0; i < block.itemCount_; i++) {
        const code = Blockly.JavaScript.valueToCode(block, `ADD${i}`, Blockly.JavaScript.ORDER_NONE) || 'null';
        elements.push(code);
    }

    return [`[${elements.join(', ')}]`, Blockly.JavaScript.ORDER_ATOMIC];
};