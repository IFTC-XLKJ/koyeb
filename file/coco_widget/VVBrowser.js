var { fetch } = globalThis;

const METHOD_COLOR = '#1E90FF';
const types = {
    isInvisibleWidget: true,
    type: "VVBROWSER",
    icon: "https://iftc.koyeb.app/static/vvbrowser.png",
    title: "VV浏览器私有接口",
    version: "1.0.0 test",
    author: "IFTC",
    doc: {
        url: "https://cuz-drive.me.uk/s/Vdt2"
    },
    isGlobalWidget: true,
    properties: [],
    methods: [],
    events: [],
};

class Widget extends InvisibleWidget {
    constructor(props) {
        super(props);
        Object.assign(this, props);
        this.nativeWidgetWarn = this.widgetWarn;
        this.widgetWarn = (message) => {
            console.warn(`[VVBrowser Widget] ${message}`);
            this.nativeWidgetWarn(message);
        };
        this.widgetWarn("IFTC官网QQ群：870350184");
        this.widgetWarn("VV浏览器下载及其文档地址：https://cuz-drive.me.uk/s/Vdt2");
        const isVVBrowser = !!globalThis.vvbrowser;
        console.log(globalThis.vvbrowser);
        this.widgetWarn(isVVBrowser ? "当前环境为VV浏览器" : "当前环境非VV浏览器");
        const that = this;
        if (!isVVBrowser) globalThis.vvbrowser = {
            version: {
                browser: {
                    name: "UNKNOWN",
                    code: 0,
                },
                webview: "UNKNOWN",
            },
            toast(message) {
                that.widgetWarn(`模拟Toast：${message}`);
            },
            File: class {
                path = '';
                constructor(filePath) {
                    this.path = filePath || '/sdcard/abc.txt';
                }
                async read() {
                    that.widgetWarn(`模拟读取文件：${this.path}`);
                    return new Promise((resolve, reject) => {
                        resolve(new Blob([`这是文件${this.path}的内容`]));
                    });
                }
                async write(blob) {
                    that.widgetWarn(`模拟写入文件：${this.path} 内容为：${blob}`);
                    return true;
                }
                async append(blob) {
                    that.widgetWarn(`模拟追加文件：${this.path} 内容为：${blob}`);
                    return true;
                }
                delete() {
                    that.widgetWarn(`模拟删除文件：${this.path}`);
                    return true;
                }
                exist() {
                    that.widgetWarn(`模拟检查文件是否存在：${this.path}`);
                    return true;
                }
                size() {
                    that.widgetWarn(`模拟获取文件大小：${this.path}`);
                    return new Promise((resolve, reject) => {
                        resolve(1024); // 模拟返回文件大小
                    });
                }
                isDir() {
                    that.widgetWarn(`模拟检查文件是否为目录：${this.path}`);
                    return true;
                }
                isFile() {
                    that.widgetWarn(`模拟检查文件是否为文件：${this.path}`);
                    return true;
                }
                lastModified() {
                    that.widgetWarn(`模拟获取文件最后修改时间：${this.path}`);
                    return Date.now();
                }
                list() {
                    that.widgetWarn(`模拟获取文件列表：${this.path}`);
                    return [
                        "/sdcard/abc.txt",
                        "/sdcard/def.txt",
                        "/sdcard/ghi.txt",
                    ]
                }
                toString() {
                    return `[File: ${this.path}] ${JSON.stringify({
                        path: this.path,
                        read: "模拟读取文件方法",
                        write: "模拟写入文件方法",
                        append: "模拟追加文件方法",
                        delete: "模拟删除文件方法",
                        exist: "模拟检查文件是否存在方法",
                        size: "模拟获取文件大小方法",
                        isDir: "模拟检查文件是否为目录方法",
                        isFile: "模拟检查文件是否为文件方法",
                        lastModified: "模拟获取文件最后修改时间方法",
                    })}`;
                }
            },
        };
    }
}

const isVVBrowser = !!globalThis.vvbrowser;
types['methods'].push({
    key: 'isVVBrowser',
    label: '是否在VV浏览器中',
    params: [],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'boolean',
    tooltip: '判断当前环境是否为VV浏览器',
})
Widget.prototype.isVVBrowser = function () {
    console.log(`当前环境是否为VV浏览器：${isVVBrowser}`);
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
    tooltip: '获取VV浏览器版本名',
})
Widget.prototype.getVVBrowserVersionName = function () {
    console.log(`当前VV浏览器版本名：${isVVBrowser ? globalThis.vvbrowser.version.browser.name : 'UNKNOWN'}`);
    return isVVBrowser ? globalThis.vvbrowser.version.browser.name : 'UNKNOWN';
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
    tooltip: '获取VV浏览器版本号',
})
Widget.prototype.getVVBrowserVersionCode = function () {
    console.log(`当前VV浏览器版本号：${isVVBrowser ? globalThis.vvbrowser.version.browser.code : 'UNKNOWN'}`);
    return isVVBrowser ? globalThis.vvbrowser.version.browser.code : 'UNKNOWN';
}
types['methods'].push({
    key: 'getVVBrowserWebViewVersion',
    label: '获取VV浏览器WebView版本',
    params: [],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
        space: 50,
    },
    valueType: 'string',
    tooltip: '获取VV浏览器WebView版本',
})
Widget.prototype.getVVBrowserWebViewVersion = function () {
    console.log(`当前VV浏览器WebView版本：${isVVBrowser ? globalThis.vvbrowser.version.webview : 'UNKNOWN'}`);
    return isVVBrowser ? globalThis.vvbrowser.version.webview : 'UNKNOWN';
}
types['methods'].push({
    key: 'toast',
    label: '显示Toast',
    params: [{
        key: 'text',
        label: '文本',
        valueType: 'string',
        defaultValue: 'Hello World',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    tooltip: '显示Toast',
});
Widget.prototype.toast = function (text) {
    console.log(`显示Toast：${text}`);
    globalThis.vvbrowser.toast(text);
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
    tooltip: '创建一个文件实例',
})
Widget.prototype.newFileInstance = function (filePath) {
    console.log(`创建文件实例：${filePath}`);
    return new globalThis.vvbrowser.File(filePath);
}
types['methods'].push({
    key: 'getFilePath',
    label: '获取',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的路径',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'string',
    tooltip: '获取文件的路径',
})
Widget.prototype.getFilePath = function (file) {
    console.log(`获取文件路径：${file.path}`);
    return file.path;
}
types['methods'].push({
    key: 'setFilePath',
    label: '设置',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的路径为',
    }, {
        key: 'path',
        label: '',
        valueType: 'string',
        defaultValue: ""
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    tooltip: '设置文件的路径',
})
Widget.prototype.setFilePath = function (file, path) {
    console.log(`设置文件路径：${file.path} -> ${path}`);
    file.path = path;
}
types['methods'].push({
    key: 'readFile',
    label: '读取文件',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的内容',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'Blob',
    tooltip: '读取文件内容，返回一个Blob对象',
})
Widget.prototype.readFile = async function (file) {
    console.log(`读取文件内容：${file.path}`);
    return await file.read();
}
types['methods'].push({
    key: 'writeFile',
    label: '写入文件',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的内容为',
    }, {
        key: 'content',
        label: '',
        valueType: ['string', 'Blob'],
        defaultValue: ""
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'boolean',
    tooltip: '写入文件内容，content必须为一个Blob对象，返回是否写入成功',
})
Widget.prototype.writeFile = async function (file, content) {
    console.log(`写入文件内容：${file.path}`);
    return await file.write(content);
}
types['methods'].push({
    key: 'appendFile',
    label: '追加文件',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的内容为',
    }, {
        key: 'content',
        label: '',
        valueType: ['string', 'Blob'],
        defaultValue: ""
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'boolean',
    tooltip: '追加文件内容，content必须为一个Blob对象，返回是否追加成功',
})
Widget.prototype.appendFile = async function (file, content) {
    console.log(`追加文件内容：${file.path}`);
    return await file.append(content);
}
types['methods'].push({
    key: 'deleteFile',
    label: '删除文件',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的文件',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'boolean',
    tooltip: '删除文件，返回是否删除成功',
})
Widget.prototype.deleteFile = async function (file) {
    console.log(`删除文件：${file.path}`);
    return await file.delete();
}
types['methods'].push({
    key: 'existFile',
    label: '检查文件是否存在',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的文件是否存在',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'boolean',
    tooltip: '检查文件是否存在，返回是否存在',
})
Widget.prototype.existFile = function (file) {
    console.log(`检查文件是否存在：${file.path}`);
    return file.exist();
}
types['methods'].push({
    key: 'getFileSize',
    label: '获取文件大小',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的文件大小',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'number',
    tooltip: '获取文件大小，返回文件的字节数',
})
Widget.prototype.getFileSize = async function (file) {
    console.log(`获取文件大小：${file.path}`);
    return await file.size();
}
types['methods'].push({
    key: 'isDir',
    label: '检查文件是否为目录',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的文件是否为目录',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'boolean',
    tooltip: '检查文件是否为目录'
})
Widget.prototype.isDir = function (file) {
    console.log(`检查文件是否为目录：${file.path}`);
    return file.isDir();
}
types['methods'].push({
    key: 'isFile',
    label: '检查文件是否为文件',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的文件是否为文件',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'boolean',
    tooltip: '检查文件是否为文件',
})
Widget.prototype.isFile = function (file) {
    console.log(`检查文件是否为文件：${file.path}`);
    return file.isFile();
}
types['methods'].push({
    key: 'getFileLastModified',
    label: '获取文件最后修改时间',
    params: [{
        key: 'file',
        label: '',
        valueType: ['File', 'string'],
        defaultValue: "",
        labelAfter: '的文件最后修改时间',
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'number',
    tooltip: '获取文件最后修改时间，返回文件的最后修改时间，单位为毫秒',
})
Widget.prototype.getFileLastModified = async function (file) {
    console.log(`获取文件最后修改时间：${file.path}`);
    return file.lastModified();
}
types['methods'].push({
    key: 'toolTextToBlob',
    label: '将文本转为Blob',
    params: [{
        key: 'text',
        label: '文本',
        valueType: 'string',
        defaultValue: "",
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
        line: "辅助工具"
    },
    valueType: 'Blob',
    tooltip: '将文本转为Blob对象',
});
Widget.prototype.toolTextToBlob = function (text) {
    console.log(`将文本转为Blob：${text}`);
    return new Blob([text]);
}
types['methods'].push({
    key: 'toolBlobToText',
    label: '将Blob转为文本',
    params: [{
        key: 'blob',
        label: 'Blob',
        valueType: ['Blob', 'string'],
        defaultValue: "",
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'string',
    tooltip: '将Blob转为文本',
})
Widget.prototype.toolBlobToText = async function (blob) {
    console.log(`将Blob转为文本：${blob}`);
    if (blob instanceof Blob && blob.text) return await blob.text();
    return null;
}
types['methods'].push({
    key: 'toolFecthFile',
    label: '从网络获取文件',
    params: [{
        key: 'url',
        label: 'URL',
        valueType: 'string',
        defaultValue: "",
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'Blob',
    tooltip: '从网络获取文件，返回一个Blob对象',
})
Widget.prototype.toolFecthFile = async function (url) {
    console.log(`从网络获取文件：${url}`);
    const response = await fetch(url);
    return await response.blob();
}
types['methods'].push({
    key: 'BlobToDataURL',
    label: '将Blob转为Data URL',
    params: [{
        key: 'blob',
        label: 'Blob',
        valueType: ['Blob', 'string'],
        defaultValue: "",
    }],
    blockOptions: {
        callMethodLabel: false,
        color: METHOD_COLOR,
    },
    valueType: 'string',
    tooltip: '将Blob转为Data URL',
});
Widget.prototype.BlobToDataURL = async function (blob) {
    console.log(`将Blob转为Data URL：${blob}`);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.readAsDataURL(blob);
    });
}

exports.types = types;
exports.widget = Widget;