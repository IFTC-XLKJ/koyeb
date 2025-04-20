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
    return (Math.random() * (10 ** 17)).toString(36)
};

const types = {
    isInvisibleWidget: true,
    type: "ZIP",
    icon: "https://iftc.koyeb.app/static/zip.svg",
    title: "压缩包",
    version: "1.0.0",
    isGlobalWidget: true,
    author: "IFTC",
    properties: [],
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
            defaultValue: 'file.txt',
        }],
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
    }],
};

class Widget extends InvisibleWidget {
    constructor(props) {
        super(props);
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
            // for (const [filename, file] of Object.entries(zip.files)) {
            //     if (!file.dir) {
            //         const content = await file.async("blob");
            //         console.log(`File: ${filename}, Content: ${content}`);
            //     }
            // }
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
        return;
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
}

exports.types = types;
exports.widget = Widget;