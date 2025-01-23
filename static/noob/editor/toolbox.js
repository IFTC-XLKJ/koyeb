const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "元素",
            colour: 160,
            contents: [
                {
                    kind: "label",
                    text: "-- 头部元素 --",
                    "web-class": "labels"
                },
                {
                    kind: "block",
                    type: "element_title",
                },
                {
                    kind: "block",
                    type: "element_charset",
                },
                {
                    kind: "block",
                    type: "element_meta",
                },
                // {
                //     kind: "block",
                //     type: "element_body",
                // },
                {
                    kind: "label",
                    text: "-- 主体元素 --",
                    "web-class": "labels"
                },
                {
                    kind: "block",
                    type: "element_h",
                },
                {
                    kind: "block",
                    type: "element_p",
                },
                {
                    kind: "block",
                    type: "element_div",
                },
            ]
        },
        {
            kind: "category",
            name: "运算",
            colour: 20,
            contents: [
                {
                    kind: "block",
                    type: "math_number",
                },
                {
                    kind: "block",
                    type: "text",
                }
            ]
        },
        {
            kind: "category",
            name: "字典",
            colour: 290,
            contents: [
                {
                    kind: "block",
                    type: "object_dict",
                },
                {
                    kind: "block",
                    type: "dict_get",
                },
                {
                    kind: "block",
                    type: "dict_set",
                },
            ]
        }
    ]
}

Blockly.defineBlocksWithJsonArray([
    {
        type: "math_number",
        message0: "%1",
        args0: [
            {
                type: "field_number",
                name: "NUM",
                value: 0
            }
        ],
        output: "Number",
        colour: 20,
        tooltip: "数字",
        helpUrl: ""
    },
    {
        type: "text",
        message0: "%1",
        args0: [
            {
                type: "field_input",
                name: "TEXT",
                text: ""
            }
        ],
        output: "String",
        colour: 20,
        tooltip: "文本",
        helpUrl: ""
    },
]);