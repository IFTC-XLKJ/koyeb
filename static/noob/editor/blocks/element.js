Blockly.Blocks['doc_type'] = {
    init: function () {
        this.setNextStatement(true);
        this.appendDummyInput()
            .appendField('文档类型')
            .appendField(new Blockly.FieldDropdown([
                ['HTML', 'html'],
                ['HTML5', 'html5'],
                ['XHTML 1.0 过渡', 'xhtml1-transitional'],
                ['HTML 4.01 过渡', 'html4-transitional']
            ]), 'DOCTYPE');
        this.setOutput(false, "String");
        this.setColour(160);
        this.setMovable(false);
        this.setDeletable(false);
    }
};
Blockly.JavaScript.forBlock['doc_type'] = function (block) {
    var doctype = block.getFieldValue('DOCTYPE');
    var code = `<!DOCTYPE ${doctype}>\n`;
    return code;
};
Blockly.Blocks['element_html'] = {
    init: function () {
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        this.appendDummyInput()
            .appendField('页面')
        this.appendStatementInput('html')
            .appendField('');
        this.setOutput(false, "String");
        this.setColour(160);
        this.setMovable(false);
        this.setDeletable(false);
    }
};
Blockly.JavaScript.forBlock['element_html'] = function (block) {
    var html = Blockly.JavaScript.statementToCode(block, 'html')
    var code = `<html>\n${html}</html>\n`;
    return code;
}
Blockly.Blocks['element_head'] = {
    init: function () {
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        this.appendDummyInput()
            .appendField('头部')
        this.appendStatementInput('html')
            .appendField('');
        this.setOutput(false, "String");
        this.setColour(160);
        this.setMovable(false);
        this.setDeletable(false);
    }
};
Blockly.JavaScript.forBlock['element_head'] = function (block) {
    var html = Blockly.JavaScript.statementToCode(block, 'html')
    var code = `<head>\n${html}</head>\n`;
    return code;
}
Blockly.Blocks['element_body'] = {
    init: function () {
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        this.appendDummyInput()
            .appendField('主体')
        this.appendStatementInput('html')
            .appendField('');
        this.setOutput(false, "String");
        this.setColour(160);
        this.setMovable(false);
        this.setDeletable(false);
    }
};
Blockly.JavaScript.forBlock['element_body'] = function (block) {
    var html = Blockly.JavaScript.statementToCode(block, 'html')
    var code = `<body>\n${html}</body>\n`;
    return code;
}
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_title",
        message0: "标题 %1",
        args0: [
            {
                type: "field_input",
                name: "TITLE",
                text: "Document"
            }
        ],
        output: "String",
        colour: 160,
        tooltip: "",
        helpUrl: ""
    }
]);
Blockly.JavaScript.forBlock['element_title'] = function (block) {
    var title = block.getFieldValue('TITLE');
    if (!title) {
        title = '';
    }
    var code = `<title>${title}</title>\n`;
    return code;
};