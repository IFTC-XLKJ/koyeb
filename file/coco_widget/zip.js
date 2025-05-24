var { window, document } = this;
var { fetch, console } = window;

const METHOD_COLOR = '#1E90FF';
window.zip_task = {};
function importScript(src, load, error) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = load;
    script.onerror = error;
    document.head.appendChild(script);
}
function genId() {
    return (Math.random() * (10 ** 17)).toString(36);
};

const types = {
    isInvisibleWidget: true,
    type: "ZIP",
    icon: "https://iftc.koyeb.app/static/zip.svg",
    title: "压缩包",
    version: "1.0.0",
    isGlobalWidget: true,
    author: "IFTC",
    description: "超实用压缩包工具",
    properties: [],
    platforms: ["web", "android"],
    methods: [{
        key: 'scriptLoaded',
        label: '资源加载完成',
        params: [],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
        valueType: 'boolean',
    }, {
        key: 'zipTask',
        label: '压缩包任务',
        params: [],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
        valueType: 'object',
    }, {
        key: 'zipTaskID',
        label: '压缩包任务ID',
        params: [],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
            space: 50,
        },
        valueType: 'array',
    }, {
        key: 'unzip',
        label: '解压',
        params: [{
            key: 'URL',
            label: 'URL',
            valueType: 'string',
            defaultValue: "https://iftc.koyeb.app/file/coco_widget/test.zip",
        },],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
            line: '解压'
        },
    }, {
        key: 'getFiles',
        label: '获取所有文件',
        params: [{
            key: 'taskId',
            label: '任务ID',
            valueType: 'string',
            defaultValue: 'taskId',
        },],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
        valueType: 'array',
    }, {
        key: 'getFile',
        label: '获取文件',
        params: [{
            key: 'taskId',
            label: '任务ID',
            valueType: 'string',
            defaultValue: 'taskId',
        }, {
            key: 'filepath',
            label: '文件名',
            valueType: 'string',
            defaultValue: 'file',
        }, {
            key: 'type',
            label: '读取类型',
            dropdown: [
                {
                    label: '字符串',
                    value: 'string',
                },
                {
                    label: 'Blob对象',
                    value: 'blob',
                },
                {
                    label: '无符号8位整数数组',
                    value: 'uint8array',
                },
            ],
            valueType: 'string',
            defaultValue: 'string',
        },],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
        valueType: 'object',
    }, {
        key: 'isDir',
        label: '是否为目录',
        params: [{
            key: 'taskId',
            label: '任务ID',
            valueType: 'string',
            defaultValue: 'taskId',
        }, {
            key: 'filepath',
            label: '文件名',
            valueType: 'string',
            defaultValue: 'file',
        },],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
        valueType: 'boolean',
    }, {
        key: 'blobToDataURL',
        label: 'Blob对象装DataURL',
        params: [{
            key: 'blob',
            label: 'Blob对象',
            valueType: ['string', 'object'],
            defaultValue: '',
        }, {
            key: 'id',
            label: 'ID',
            valueType: 'string',
            defaultValue: 'id',
        },],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
        tooltip: '可将获取文件的Blob对象转换成DataURL，如图片的Blob对象转换成DataURL就能使用图片框显示',
    }, {
        key: 'newZip',
        label: '创建压缩包',
        params: [],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
            line: '压缩',
        },
        valueType: 'string',
        tooltip: '返回任务ID'
    }, {
        key: 'addFile',
        label: '添加文件',
        params: [{
            key: 'taskId',
            label: '任务ID',
            valueType: 'string',
            defaultValue: 'taskId',
        }, {
            key: 'filepath',
            label: '文件名',
            valueType: 'string',
            defaultValue: 'file.txt',
        }, {
            key: 'content',
            label: '内容',
            valueType: ['string', 'object'],
            defaultValue: '',
        },],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
    }, {
        key: 'addFolder',
        label: '添加文件夹',
        params: [{
            key: 'taskId',
            label: '任务ID',
            valueType: 'string',
            defaultValue: 'taskId',
        }, {
            key: 'dirname',
            label: '文件夹名',
            valueType: 'string',
            defaultValue: 'file',
        }],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
    }, {
        key: 'removeFileOrFolder',
        label: '移除文件或文件夹',
        params: [{
            key: 'taskId',
            label: '任务ID',
            valueType: 'string',
            defaultValue: 'taskId',
        }, {
            key: 'filepath',
            label: '文件或文件夹名',
            valueType: 'string',
            defaultValue: 'file.txt',
        },],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
    }, {
        key: 'genZip',
        label: '生成压缩包',
        params: [{
            key: 'taskId',
            label: '任务ID',
            valueType: 'string',
            defaultValue: 'taskId',
        },],
        blockOptions: {
            callMethodLabel: false,
            color: METHOD_COLOR,
        },
    },],
    events: [{
        key: 'scriptLoad',
        label: '资源加载完成',
        params: [],
    }, {
        key: 'scriptErr',
        label: '资源加载失败',
        params: [],
    }, {
        key: 'unzipSuccess',
        label: '解压成功',
        params: [{
            key: 'taskId',
            label: '任务ID',
            valueType: 'string',
        }],
    }, {
        key: 'unzipFailure',
        label: '解压失败',
        params: [{
            key: 'msg',
            label: '错误信息',
            valueType: 'string',
        }],
    }, {
        key: 'blobToDataURLed',
        label: 'Blob对象转DataURL完成',
        params: [{
            key: 'id',
            label: 'ID',
            valueType: 'string',
        }, {
            key: 'dataUrl',
            label: 'DataURL',
            valueType: 'string',
        }],
    }, {
        key: 'genSuccess',
        label: '生成成功',
        params: [{
            key: 'blob',
            label: 'Blob对象',
            valueType: 'object',
        }],
    }, {
        key: 'genFailure',
        label: '生成失败',
        params: [{
            key: 'msg',
            label: '错误信息',
            valueType: 'string',
        }],
    },],
};

class Widget extends InvisibleWidget {
    constructor(props) {
        super(props);
        this.widgetWarn("IFTC官网QQ群：870350184");
        this.widgetWarn("官方文档：<a href=\"https://cocowidget.fandom.com/zh/wiki/Zip\">https://cocowidget.fandom.com/zh/wiki/Zip</a>");
        this.scriptLoaded = () => {
            return false;
        }
        importScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", () => {
            this.emit("scriptLoad");
            this.scriptLoaded = () => {
                return true;
            };
        }, e => this.emit("scriptErr") || console.log(e) || this.widgetError(e.message));
    }
    async fetchAndUnzip(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);
            return zip;
        } catch (error) {
            console.error('Error fetching or unzipping the file:', error);
            this.widgetError("unzipFailure", error.message);
        }
    }
    async unzip(url) {
        const json = await this["fetchAndUnzip"](url);
        console.log(json);
        const taskId = genId();
        window.zip_task[taskId] = json;
        this.emit("unzipSuccess", taskId);
    }
    zipTask() {
        return window.zip_task;
    }
    getFiles(taskId) {
        const zip = window.zip_task[taskId];
        if (!zip) return null;
        const files = Object.keys(zip.files);
        return files;
    }
    async getFile(taskId, filepath, type) {
        const zip = window.zip_task[taskId];
        if (!zip) return null;
        const file = zip.files[filepath];
        const content = await file.async(type);
        return content;
    }
    newZip() {
        const taskId = genId();
        window.zip_task[taskId] = new JSZip();
        return taskId;
    }
    textToBlob(text) {
        const blob = new Blob([text], { type: 'text/plain' });
        return blob;
    }
    addFile(taskId, filename, content) {
        const zip = window.zip_task[taskId];
        if (!zip) return null;
        if (typeof content == 'string') content = this.textToBlob(content);
        zip.file(filename, content);
    }
    addFolder(taskId, dirname) {
        const zip = window.zip_task[taskId];
        if (!zip) return null;
        zip.folder(dirname);
    }
    blobToDataURL(blob, id) {
        const reader = new FileReader();
        const that = this;
        reader.onloadend = function() {
            const dataUrl = reader.result;
            console.log(dataUrl);
            that.emit("blobToDataURLed", id, dataUrl);
        };
        reader.readAsDataURL(blob);
    }
    isDir(taskId, filename) {
        const zip = window.zip_task[taskId];
        if (!zip) return null;
        const file = zip.files[filename];
        return file.dir;
    }
    async genZip(taskId) {
        const zip = window.zip_task[taskId];
        if (!zip) {
            this.widgetError("未知的压缩包任务");
            return null;
        }
        try {
            const content = await zip.generateAsync({type:"blob"});
            this.emit("genSuccess", content);
        } catch(e) {
            this.emit("genFailure", e.message);
        }
    }
    removeFileOrFolder(taskId, filepath) {
        const zip = window.zip_task[taskId];
        if (!zip) return null;
        zip.remove(filepath);
    }
    zipTaskID() {
        return Object.keys(window.zip_task);
    }
}

exports.types = types;
exports.widget = Widget;