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
                {
                    kind: "block",
                    type: "element_link",
                },
                {
                    kind: "block",
                    type: "element_style",
                },
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
                {
                    kind: "block",
                    type: "element_span",
                },
                {
                    kind: "block",
                    type: "element_img",
                },
                {
                    kind: "block",
                    type: "element_a",
                },
                {
                    kind: "block",
                    type: "element_br",
                },
            ]
        },
        {
            kind: "category",
            name: "样式",
            colour: 230,
            contents: [
                {
                    kind: "block",
                    type: "style_group",
                },
                {
                    kind: "block",
                    type: "style_selector",
                },
                // {
                //     kind: "block",
                //     type: "element_style_css_property",
                // },
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
                    fields: {
                        TEXT: "Hello,NOOB!"
                    }
                },
                {
                    kind: "block",
                    type: "text_join",
                },
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