const METHOD_COLOR = '#1E90FF';
const types = {
    isInvisibleWidget: true,
    type: "VVBROWSER",
    icon: "https://iftc.koyeb.app/static/vvbrowser.png",
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
        const isVVBrowser = !!globalThis.isVVBrowser;
        this.widgetWarn(isVVBrowser ? "当前环境为VV浏览器" : "当前环境非VV浏览器");
        if (!isVVBrowser) globalThis.vvbrowser = {
            version: {
                browser: {
                    name: "UNKNOWN",
                    code: 0,
                },
                webview: "UNKNOWN",
            },
            File: class {
                path = '';
                constructor(filePath) {
                    this.path = filePath;
                }
                toString() {
                    return `[File: ${this.path}] ${JSON.stringify(this)}`;
                }
            },
        };
    }
}

const isVVBrowser = !!globalThis.isVVBrowser;
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
    return isVVBrowser;
}
types['methods'].push({
    key: 'getVVBrowserVersionName',
    label: '获取VV浏览器版本名',
    params: [],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'string',
})
Widget.prototype.getVVBrowserVersionName = function () {
    return globalThis.isVVBrowser ? globalThis.vvbrowser.version.browser.name : 'UNKNOWN';
}
types['methods'].push({
    key: 'getVVBrowserVersionCode',
    label: '获取VV浏览器版本号',
    params: [],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'string',
})
Widget.prototype.getVVBrowserVersionCode = function () {
    return globalThis.isVVBrowser ? globalThis.vvbrowser.version.browser.code : 'UNKNOWN';
}
types['methods'].push({
    key: 'getVVBrowserWebViewVersion',
    label: '获取VV浏览器WebView版本',
    params: [],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'string',
})
Widget.prototype.getVVBrowserWebViewVersion = function () {
    return globalThis.isVVBrowser ? globalThis.vvbrowser.version.webview : 'UNKNOWN';
}
types['methods'].push({
    key: 'newFileInstance',
    label: '创建文件实例',
    params: [{
        key: 'filePath',
        label: '文件路径',
        valueType: 'string',
        defaultValue: '/sdcard/test.txt',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
        line: "操作文件"
    },
    valueType: 'File',
})
Widget.prototype.newFileInstance = function (filePath) {
    return new vvbrowser.File(filePath);
}
types['methods'].push({
    key: 'getFilePath',
    label: '获取',
    params: [{
        key: 'file',
        label: '',
        valueType: 'File',
        defaultValue: '',
        labelAfter: '的路径',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'string',
})
Widget.prototype.getFilePath = function (file) {
    return file.path;
}
types['methods'].push({
    key: 'setFilePath',
    label: '设置',
    params: [{
        key: 'file',
        label: '',
        valueType: 'File',
        defaultValue: '',
        labelAfter: '的路径',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
})
Widget.prototype.setFilePath = function (file, path) {
    file.path = path;
}

exports.types = types;
exports.widget = Widget;