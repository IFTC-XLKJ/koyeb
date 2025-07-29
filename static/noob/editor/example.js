const types = {
    name: "example",
    version: "1.0.0",
    author: "IFTC",
    color: "#008cff",
    blocks: [
        {
            key: "exampleblock",
            params: [
                {
                    label: "Text",
                },
                {
                    label: "InputValue",
                    inputValue: {
                        key: "inputValue",
                        checkType: "String",
                    },
                },
            ],
            color: "#008cff",
            tooltip: "Example Block",
            labelText: "example",
        },
        {
            key: "exampleblock_return",
            params: [
                {
                    label: "Text",
                    inputValue: {
                        key: "inputValue",
                        checkType: "String",
                    },
                },
            ],
            valueType: ["String"],
            color: "#008cff",
            tooltip: "Example Block",
            labelText: "example",
        },
    ],
};

class Ext {
    constructor() {
    }
    static exampleblock(paramsValue) {
        console.log("example", paramsValue.inputValue);
    }
    static exampleblock_return(paramsValue) {
        return "example" + paramsValue.inputValue;
    }
}

exports.types = types;
exports.Ext = Ext;