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
                    labelText: "example",
                    inputValue: {},
                    color: "#008cff",
                    tooltip: "Example Block",
                },
            ],
        },
    ],
};

class Ext { 
    constructor() {
    }
    static exampleblock() {
        console.log("example");
    }
}

exports.types = types;
exports.Ext = Ext;