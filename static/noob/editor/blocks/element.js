// 文档类型
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
// 页面
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
// 头部
Blockly.Blocks['element_head'] = {
    init: function () {
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        this.appendDummyInput()
            .appendField('头部')
        this.appendStatementInput('html')
            .appendField('')
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
// 主体
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
// 标题
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
        colour: 160,
        tooltip: "",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
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
// 文档编码
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_charset",
        message0: "编码 %1",
        args0: [
            {
                type: "field_input",
                name: "CHARSET",
                text: "utf-8"
            }
        ],
        colour: 160,
        tooltip: "",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
    }
])
Blockly.JavaScript.forBlock['element_charset'] = function (block) {
    var charset = block.getFieldValue('CHARSET');
    var code = `<meta charset="${charset}">\n`;
    return code;
};
// 元数据
Blockly.defineBlocksWithJsonArray([
    {
        type: "element_meta",
        message0: "元 名称 %1 内容 %2",
        args0: [
            {
                type: "field_input",
                name: "NAME",
                text: "description"
            },
            {
                type: "field_input",
                name: "CONTENT",
                text: "IFTC"
            }
        ],
        colour: 160,
        tooltip: "",
        helpUrl: "",
        nextStatement: true,
        previousStatement: true,
    }
]);
Blockly.JavaScript.forBlock['element_meta'] = function (block) {
    var name = block.getFieldValue('NAME');
    var content = block.getFieldValue('CONTENT');
    var code = `<meta name="${name}" content="${content}">\n`;
    return code;
};