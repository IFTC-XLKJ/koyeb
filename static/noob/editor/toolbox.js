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
                    kind: "block",
                    type: "element_script",
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
                    inputs: {
                        STYLE: {
                            shadow: {
                                type: "style_selector",
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "style_color",
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
            name: "变量",
            colour: 330,
            contents: [
                {
                    kind: "button",
                    text: "创建变量",
                    callbackKey: "createVar",
                    "web-class": "createVar"
                },
                {
                    kind: "block",
                    type: "variables_get",
                },
                {
                    kind: "block",
                    type: "variables_set",
                    inputs: {
                        VALUE: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "value"
                                }
                            }
                        }
                    }
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
                    inputs: {
                        DICT: {
                            shadow: {
                                type: "variables_get",
                            }
                        },
                        KEY: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "key"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "dict_set",
                    inputs: {
                        DICT: {
                            shadow: {
                                type: "variables_get",
                            }
                        },
                        KEY: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "key"
                                }
                            }
                        },
                        VALUE: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "value"
                                }
                            }
                        }
                    }
                },
            ]
        }
    ]
}