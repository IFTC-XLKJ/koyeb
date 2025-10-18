const types = {
    name: "WebApp",
    version: "1.0.0",
    author: "IFTC",
    color: "#008cff",
    blocks: [
        {
            key: "getAppName",
            params: [
                {
                    label: "获取应用名称",
                },
            ],
            valueType: ["String"],
            color: "#008cff",
            tooltip: "Example Block",
        },
        // {
        //     key: "exampleblock",
        //     params: [
        //         {
        //             label: "Text",
        //         },
        //         {
        //             label: "InputValue",
        //             inputValue: {
        //                 key: "inputValue",
        //                 checkType: "String",
        //             },
        //         },
        //         {
        //             label: "Dropdown",
        //             dropdown: {
        //                 key: "dropdown",
        //                 options: [
        //                     ["Option 1", "option1"],
        //                     ["Option 2", "option2"],
        //                     ["Option 3", "option3"],
        //                 ],
        //             }
        //         },
        //     ],
        //     color: "#008cff",
        //     tooltip: "Example Block",
        //     labelText: "example",
        // },
        // {
        //     key: "exampleblock_return",
        //     params: [
        //         {
        //             label: "Text",
        //             inputValue: {
        //                 key: "inputValue",
        //                 checkType: "String",
        //             },
        //         },
        //         {
        //             label: "Dropdown",
        //             dropdown: {
        //                 key: "dropdown",
        //                 options: [
        //                     ["Option 1", "option1"],
        //                     ["Option 2", "option2"],
        //                     ["Option 3", "option3"],
        //                 ],
        //             }
        //         },
        //     ],
        //     valueType: ["String"],
        //     color: "#008cff",
        //     tooltip: "Example Block",
        //     labelText: "example",
        // },
    ],
};

class Ext {
    constructor() {
        console.log(globalThis.webapp);
        if (typeof globalThis.webapp === "undefined") globalThis.webapp = {
            获取应用名称: function () {
                return "Debug WebApp";
            },
        };
    }
    static getAppName() {
        return webapp.获取应用名称();
    }
}

exports.types = types;
exports.Ext = Ext;