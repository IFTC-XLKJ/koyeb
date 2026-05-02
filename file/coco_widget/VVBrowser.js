const METHOD_COLOR = '#1E90FF';
const types = {
    isInvisibleWidget: true,
    type: "VVBROWSER",
    icon: "https://cdn.cocotais.cn/project/waddle-2/logo/waddle2-logo.svg",
    title: "VV浏览器私有接口",
    version: "1.0.0",
    isGlobalWidget: true,
    properties: [],
    methods: [],
    events: [],
};

class Widget extends InvisibleWidget {
    constructor(props) {
        super(props);
        Object.assign(this, props);
        this.widgetWarn("IFTC官网QQ群：870350184");
    }
}

types['methods'].push({
    key: 'isVVBrowser',
    label: '是否在VV浏览器中',
    params: [],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'boolean',
})
Widget.prototype.isVVBrowser = function () {
    return !!globalThis.isVVBrowser;
}

exports.types = types;
exports.widget = Widget;