const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "元素",
            colour: 100,
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
            ]
        },
        {
            kind: "category",
            name: "字典",
            colour: 200,
            contents: [
                {
                    kind: "block",
                    type: "object_dict",
                }
            ]
        }
    ]
}