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
                    inputValue: {},
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
                    inputValue: {},
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
    static exampleblock() {
        console.log("example");
    }
    static exampleblock_return() {
        return "example";
    }
}

exports.types = types;
exports.Ext = Ext;