let vars = [
    ["变量", "variable"]
]

Blockly.defineBlocksWithJsonArray([
    {
        type: "variables_get",
        message0: "%1",
        args0: [
            {
                type: "field_vars",
                name: "VARIABLE",
                options: vars
            }
        ],
        inputsInline: true,
        output: null,
        tooltip: "获取变量",
        helpUrl: "",
        colour: "#FDBA54",
    },
    {
        type: "variables_set",
        message0: "设置变量 %1 为 %2",
        args0: [
            {
                type: "field_vars",
                name: "VARIABLE",
                options: vars
            },
            {
                type: "input_value",
                name: "VALUE",
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        tooltip: "设置变量",
        helpUrl: "",
        colour: "#FDBA54",
    },
    {
        type: "variables_get_dynamic",
        message0: "变量 %1",
        args0: [
            {
                type: "field_vars",
                name: "VARIABLE",
                options: vars
            }
        ],
    },
    {
        type: "variables_change",
        message0: "将变量 %1 %2 %3",
        args0: [
            {
                type: "field_vars",
                name: "VARIABLE",
                options: vars
            },
            {
                type: "field_dropdown",
                name: "OPERATOR",
                options: [
                    ["增加", "+="],
                    ["减少", "-="],
                    ["乘以", "*="],
                    ["除以", "/="]
                ]
            },
            {
                type: "input_value",
                name: "VALUE"
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: "#FDBA54",
    }
])

Blockly.JavaScript.forBlock["variables_set"] = function (block) {
    var variable = block.getFieldValue("VARIABLE");
    var value = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ATOMIC) || "void 0";
    var code = word(variable) + " = " + value + ";\n";
    return code;
}

Blockly.JavaScript.forBlock["variables_get"] = function (block) {
    var variable = block.getFieldValue("VARIABLE");
    var code = word(variable);
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock["variables_define"] = function (block) {
    var variable = block.getFieldValue("VARIABLE");
    var value = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ATOMIC) || "0";
    var code = "let " + word(variable) + " = " + value + ";\n";
    return code;
}

Blockly.JavaScript.forBlock["variables_change"] = function (block) {
    const variable = block.getFieldValue("VARIABLE");
    const operator = block.getFieldValue("OPERATOR");
    const value = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ATOMIC) || "void 0";
    return `${word(variable)} ${operator} ${value}`;
}

function word(word) {
    return encodeURIComponent(word).replaceAll("%", "_");
}

Blockly.FieldVars = class extends Blockly.FieldDropdown {
    constructor(opt_value, opt_validator) {
        super(vars, opt_validator);
        const options = this.getOptions();
        this.setValue(opt_value || options[0][1]);
    }
    getOptions() {
        return vars;
    }
    showEditor_() {
        super.showEditor_();
        this.doValueUpdate_(this.getOptions());
    }
};
Blockly.fieldRegistry.register("field_vars", Blockly.FieldVars)