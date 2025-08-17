let loadend = false;
const script = this.document.createElement("script");
script.src = "https://iftc.koyeb.app/static/VED.js";
script.onload = () => {
    loadend = true;
};
this.document.head.appendChild(script);
const METHOD_COLOR = '#1E90FF';
const types = {
    isInvisibleWidget: true,
    type: "VED",
    icon: "https://iftc.koyeb.app/favicon.ico",
    title: "VED",
    author: "IFTC",
    version: "1.0.0",
    isGlobalWidget: true,
    description: "超实用加密解密工具",
    properties: [],
    platforms: ["web", "android"],
    methods: [{
        key: "init",
        label: "是否初始化完成",
        params: [],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
        valueType: "boolean",
        tooltip: "是否初始化完成",
    }, {
        key: 'encode',
        label: '加密',
        params: [{
            key: 'text',
            label: '文本',
            valueType: 'string',
            defaultValue: '',
        }, {
            key: 'key',
            label: '密钥',
            valueType: 'string',
            defaultValue: '',
        }],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
        valueType: 'string',
        tooltip: '将文本加密成密文',
    }, {
        key: 'decode',
        label: '解密',
        params: [{
            key: 'text',
            label: '文本',
            valueType: 'string',
            defaultValue: '',
        }, {
            key: 'key',
            label: '密钥',
            valueType: 'string',
            defaultValue: '',
        }],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
        valueType: 'string',
        tooltip: '将密文解密成文本，解密错误后返回null',
    }],
    events: [],
}
exports.types = types;
exports.widget = class extends InvisibleWidget {
    init() {
        return loadend;
    }
    encode(text, key) {
        if (!loadend) return this.widgetError('未初始化');
        return VED.encode(text, key);
    }
    decode(text, key) {
        if (!loadend) return this.widgetError('未初始化');
        return VED.decode(text, key);
    }
}