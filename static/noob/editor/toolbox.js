const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "元素",
            colour: "#449CD6",
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
                    inputs: {
                        ATTRIBUTE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                        STYLE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "element_p",
                    inputs: {
                        ATTRIBUTE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                        STYLE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "element_div",
                    inputs: {
                        ATTRIBUTE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                        STYLE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "element_span",
                    inputs: {
                        ATTRIBUTE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                        STYLE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "element_img",
                    inputs: {
                        ATTRIBUTE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                        STYLE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "element_a",
                    inputs: {
                        ATTRIBUTE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                        STYLE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                    }
                },
                {
                    kind: "block",
                    type: "element_br",
                },
                {
                    kind: "block",
                    type: "element_hr",
                    inputs: {
                        ATTRIBUTE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                        STYLE: {
                            shadow: {
                                type: "object_dict",
                            }
                        },
                    }
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
                {
                    kind: "block",
                    type: "style_background_color",
                },
                {
                    kind: "block",
                    type: "style_font_size",
                },
                {
                    kind: "block",
                    type: "style_border",
                },
                {
                    kind: "block",
                    type: "style_border_radius",
                },
                {
                    kind: "block",
                    type: "style_margin",
                },
                {
                    kind: "block",
                    type: "style_padding",
                },
            ]
        },
        {
            kind: "category",
            name: "属性",
            colour: 120,
            contents: [
                {
                    kind: "block",
                    type: "attr_get",
                },
                {
                    kind: "block",
                    type: "attr_data_get",
                },
                {
                    kind: "block",
                    type: "attr_target_value"
                },
            ]
        },
        {
            kind: "category",
            name: "运算",
            colour: "#F8AA87",
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
                    type: "boolean"
                },
                {
                    kind: "block",
                    type: "text_join",
                    inputs: {
                        ADD0: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "Hello"
                                }
                            }
                        },
                        ADD1: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "NOOB!"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "num_operator",
                    inputs: {
                        NUM0: {
                            shadow: {
                                type: "math_number",
                                fields: {
                                    NUM: 1
                                }
                            }
                        },
                        NUM1: {
                            shadow: {
                                type: "math_number",
                                fields: {
                                    NUM: 1
                                }
                            }
                        }
                    }
                },
            ]
        },
        {
            kind: "category",
            name: "变量",
            colour: "#FDBA54",
            contents: [
                {
                    kind: "button",
                    text: "创建变量",
                    callbackKey: "createVar",
                    "web-class": "varBtn"
                },
                {
                    kind: "button",
                    text: "重命名变量",
                    callbackKey: "renameVar",
                    "web-class": "varBtn"
                },
                {
                    kind: "button",
                    text: "删除变量",
                    callbackKey: "deleteVar",
                    "web-class": "varBtn"
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
            name: "列表",
            colour: "#F9CC37",
            contents: [
                {
                    kind: "block",
                    type: "array_create",
                },
                {
                    kind: "block",
                    type: "array_get",
                    inputs: {
                        ARRAY: {
                            shadow: {
                                type: "variables_get",
                            }
                        },
                        INDEX: {
                            shadow: {
                                type: "math_number",
                                fields: {
                                    NUM: 0
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "array_set",
                    inputs: {
                        ARRAY: {
                            shadow: {
                                type: "variables_get",
                            }
                        },
                        INDEX: {
                            shadow: {
                                type: "math_number",
                                fields: {
                                    NUM: 0
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
                }
            ]
        },
        {
            kind: "category",
            name: "字典",
            colour: "#9F73FE",
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
                {
                    kind: "block",
                    type: "dict_parse_string",
                    inputs: {
                        DICT: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: '{\"key\":\"value\"}'
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "dict_parse_object",
                    inputs: {
                        DICT: {
                            shadow: {
                                type: "object_dict",
                            }
                        }
                    }
                }
            ]
        },
        {
            kind: "category",
            name: "脚本",
            colour: "#68CDFF",
            contents: [
                {
                    kind: "block",
                    type: "window"
                },
                {
                    kind: "block",
                    type: "controls_if",
                },
                {
                    kind: "block",
                    type: "script_void",
                    inputs: {
                        code: {
                            shadow: {
                                type: "math_number",
                                fields: {
                                    NUM: 0,
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "script_console",
                    inputs: {
                        content: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "Hello,NOOB!",
                                }
                            }
                        }
                    },
                },
                {
                    kind: "block",
                    type: "script_console_clear",
                },
                {
                    kind: "block",
                    type: "script_throw",
                    inputs: {
                        type: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "CustomError",
                                }
                            }
                        },
                        content: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "Hello,NOOB!",
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "script_try_catch",
                    inputs: {
                        TRY: {
                            block: {
                                type: "script_console",
                                inputs: {
                                    content: {
                                        shadow: {
                                            type: "text",
                                            fields: {
                                                TEXT: "Hello,NOOB!"
                                            }
                                        }
                                    }
                                },
                                fields: {
                                    type: "log",
                                },
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "script_try_catch_geterror",
                },
                {
                    kind: "block",
                    type: "wait_for_seconds",
                    inputs: {
                        SECONDS: {
                            shadow: {
                                type: "math_number",
                                fields: {
                                    NUM: 1
                                }
                            }
                        }
                    }
                },
            ]
        },
        {
            kind: "category",
            name: "事件",
            colour: "#608FEE",
            contents: [
                {
                    kind: "block",
                    type: "add_event_listener",
                    inputs: {
                        element: {
                            shadow: {
                                type: "window"
                            }
                        },
                        func: {
                            shadow: {
                                type: "function_var"
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "remove_event_listener",
                    inputs: {
                        element: {
                            shadow: {
                                type: "window"
                            }
                        },
                        func: {
                            shadow: {
                                type: "function_var"
                            }
                        }
                    }
                },
            ],
        },
        {
            kind: "category",
            name: "文档",
            colour: "#9C004B",
            contents: [
                {
                    kind: "block",
                    type: "get_document",
                },
                {
                    kind: "block",
                    type: "get_document_element",
                    inputs: {
                        ELEMENT: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "body"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "get_document_elements",
                    inputs: {
                        ELEMENT: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "body"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "get_document_element_by_id",
                    inputs: {
                        ID: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "element-id"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "get_document_element_by_class",
                    inputs: {
                        CLASS: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "element-class"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "get_document_body",
                },
                {
                    kind: "block",
                    type: "get_document_head",
                },
                {
                    kind: "block",
                    type: "get_document_title",
                },
                {
                    kind: "block",
                    type: "set_document_title",
                    inputs: {
                        TITLE: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "Hello,NOOB!"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "get_element_attribute",
                    inputs: {
                        ELEMENT: {
                            shadow: {
                                type: "get_document_element",
                                inputs: {
                                    ELEMENT: {
                                        shadow: {
                                            type: "text",
                                            fields: {
                                                TEXT: "body"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        ATTRIBUTE: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "attribute"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "set_element_attribute",
                    inputs: {
                        ELEMENT: {
                            shadow: {
                                type: "get_document_element",
                                inputs: {
                                    ELEMENT: {
                                        shadow: {
                                            type: "text",
                                            fields: {
                                                TEXT: "body"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        ATTRIBUTE: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "attribute"
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
                {
                    kind: "block",
                    type: "get_element_style",
                    inputs: {
                        ELEMENT: {
                            shadow: {
                                type: "get_document_element",
                                inputs: {
                                    ELEMENT: {
                                        shadow: {
                                            type: "text",
                                            fields: {
                                                TEXT: "body"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        STYLE_PROPERTY: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "style-property"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "set_element_style",
                    inputs: {
                        ELEMENT: {
                            shadow: {
                                type: "get_document_element",
                                inputs: {
                                    ELEMENT: {
                                        shadow: {
                                            type: "text",
                                            fields: {
                                                TEXT: "body"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        STYLE_PROPERTY: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "style-property"
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
                }
            ]
        },
        {
            kind: "category",
            name: "函数",
            colour: "#F88767",
            contents: [
                {
                    kind: "block",
                    type: "function",
                    inputs: {
                        PARAM: {
                            shadow: {
                                type: "array_create",
                                fields: {}
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "function_param",
                },
                {
                    kind: "block",
                    type: "return",
                },
                {
                    kind: "block",
                    type: "function_call",
                    inputs: {
                        PARAM: {
                            shadow: {
                                type: "array_create",
                                fields: {}
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "function_return",
                    inputs: {
                        PARAM: {
                            shadow: {
                                type: "array_create",
                                fields: {}
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "function_var",
                },
            ]
        },
        {
            kind: "category",
            name: "VV组件",
            colour: "#FF6680",
            contents: [
                {
                    kind: "block",
                    type: "vv_dragger",
                    inputs: {
                        selector: {
                            shadow: {
                                type: "text",
                                fields: {
                                    TEXT: "selector"
                                }
                            }
                        },
                    }
                },
            ]
        },
        {
            kind: "category",
            name: "更多",
            colour: "#FF6680",
            contents: [
                {
                    kind: "block",
                    type: "load_Eruda",
                },
            ]
        },
        {
            kind: "category",
            name: "MDUI",
            colour: "#6750A4",
            contents: [
                {
                    kind: "block",
                    type: "mdui_design_token",
                },
                {
                    kind: "block",
                    type: "mdui_theme",
                    inputs: {
                        THEME: {
                            shadow: {
                                type: "object_dict",
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "mdui_theme_default",
                },
                {
                    kind: "block",
                    type: "mdui_button",
                }
            ],
        },
    ]
}