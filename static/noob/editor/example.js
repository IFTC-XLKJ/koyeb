const types = {
    name: "example",
    version: "1.0.0",
    author: "IFTC",
    blocks: [
        {
            key: "exampleblock",
            params: [
                {
                    label: "Text",
                    labelText: "example",
                    inputValue: {},
                },
            ],
        },
    ],
};

class Ext {
    constructor() {
        this.name = "example";
    }
    exampleblock() {
        console.log("exampleblock");
    }
}

exports.types = types;
exports.Ext = Ext;