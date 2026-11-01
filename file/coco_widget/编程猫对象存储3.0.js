var document = this.document;
var window = this.window;
var fetch = window["fetch"];
var console = window["console"];
console.log(fetch)
window.BCM_FILE_UPLOADER = null;

const url = 'https://api.pgaot.com/user/up_cat_file';
const types = {
    isInvisibleWidget: true,
    type: "BCM_FILE_UPLOADER",
    icon: "https://static.codemao.cn/whitef/favicon.ico",
    title: "编程猫对象存储3.0",
    version: "3.0.0",
    isGlobalWidget: true,
    author: "IFTC",
    properties: [],
    methods: [],
    events: [],
};

class Widget extends InvisibleWidget {
    constructor(props) {
        super(props);
        Object.assign(this, props);
        this.file = null;
        console.log(this);
        this.widgetLog(`版本 ${this.version}`);
        this.widgetWarn(`路径请在选择好文件前设置`)
        window.BCM_FILE_UPLOADER = this;
    }
}

types['properties'].push({
    key: 'path',
    label: '路径',
    valueType: 'string',
    defaultValue: 'bcx',
})

types['methods'].push({
    key: 'choose',
    label: '选择文件',
    params: [
        {
            key: 'type',
            label: '类型',
            valueType: 'string',
            defaultValue: "image/*",
        }, {
            key: 'required',
            label: '必填',
            valueType: 'boolean',
            defaultValue: false,
        },
    ],
})
Widget.prototype.choose = function (type, required) {
    initFile();
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = type;
    input.required = required;
    input.id = 'FILE_UPLOADER';
    input.style.display = 'none';
    document.getElementById('root').appendChild(input);
    var f = document.getElementById('FILE_UPLOADER');
    f.click();
    f.onchange = e => {
        this.file = f.files[0];
        this.widgetLog(`文件选择完毕 ${this.file.name}`);
        this.emit('change', this.file);
        console.log(this.file);
    }
}

types['events'].push({
    key: 'change',
    label: '选择完毕',
    params: [
        {
            key: 'file',
            label: '文件',
            valueType: 'object',
        },
    ],
    tooltip: '返回的文件可以读取文件文件名等信息'
})

types['methods'].push({
    key: 'File',
    label: '文件',
    params: [],
    valueType: 'object',
})
Widget.prototype.File = function () {
    return this.file;
}

types['methods'].push({
    key: 'upload',
    label: '上传文件',
    params: [],
})
Widget.prototype.upload = async function () {
    const data = new FormData();
    data.append('path', this.path);
    data.append('file', this.file);
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
        });
        if (response.ok) {
            const result = await response.json();
            this.widgetLog(result);
            this.emit('success', result, `https://static.codemao.cn/${result.key}`);
        } else {
            const error = await response.text();
            this.widgetError(error);
            this.emit('error', error);
        }
    } catch (e) {
        this.widgetError(e);
        this.emit('error', e);
    }
}

types['events'].push({
    key: 'success',
    label: '成功',
    params: [
        {
            key: 'result',
            label: 'JSON',
            valueType: 'object',
        },
        {
            key: 'url',
            label: '链接',
            valueType: 'string',
        },
    ],
})

types['events'].push({
    key: 'error',
    label: '出错',
    params: [
        {
            key: 'result',
            label: 'JSON',
            valueType: 'object',
        },
    ],
})

types['methods'].push({
    key: 'isHave',
    label: '是否有文件',
    params: [],
    valueType: 'boolean',


})
Widget.prototype.isHave = function () {
    var f = document.getElementById('FILE_UPLOADER');
    return f ? f.files.length > 0 ? true : false : false;
}

types['methods'].push({
    key: 'clear',
    label: '清空文件',
    params: [],
})
Widget.prototype.clear = function () {
    initFile();
}

function initFile() {
    var f = document.getElementById('FILE_UPLOADER');
    if (f) {
        f.remove();
        this.file = null;
    }
}

types['methods'].push({
    key: 'parserFile',
    label: '解析文件',
    params: [
        {
            key: 'file',
            label: '文件',
            valueType: ['string', 'object'],
            defaultValue: new File([], "empty.txt", { type: 'text/plain' }),
        },
        {
            key: 'type',
            label: '类型',
            valueType: 'string',
            defaultValue: "",
            dropdown: [
                { label: '文件名', value: 'name' },
                { label: '文件大小', value: 'size' },
                { label: '文件类型', value: 'type' },
                { label: '最后修改时间戳', value: 'lastModified' },
                { label: '最后修改日期', value: 'lastModifiedDate' },
            ],
        }
    ],
    valueType: ['string', 'number', 'boolean', 'object', 'array'],
    tooltip: '解析文件信息，传入文件对象，不是文件对象会默认使用选择的文件对象',
})
Widget.prototype.parserFile = function (file, type) {
    if (typeof file == 'string') {
        file = this.File();
    }
    if (!file) {
        return null;
    }
    if (type == 'name') {
        return file.name;
    } else if (type == 'size') {
        return file.size;
    } else if (type == 'type') {
        return file.type;
    } else if (type == 'lastModified') {
        return file.lastModified;
    } else if (type == 'lastModifiedDate') {
        return file.lastModifiedDate;
    }
}
types['methods'].push({
    key: 'getBlobUrl',
    label: '获取Blob链接',
    params: [
        {
            key: 'file',
            label: '文件',
            valueType: ['string', 'object'],
            defaultValue: new File([], "empty.txt", { type: 'text/plain' }),
        },
    ],
    valueType: 'string',
    tooltip: '获取文件的Blob链接，传入文件对象，不是文件对象会默认使用选择的文件对象',
})
Widget.prototype.getBlobUrl = function (file) {
    if (typeof file == 'string') {
        file = this.File();
    }
    if (!file) {
        return null;
    }
    return URL.createObjectURL(file);
}

types['methods'].push({
    key: 'getDataUrl',
    label: '获取DataURL',
    params: [
        {
            key: 'file',
            label: '文件',
            valueType: ['string', 'object'],
            defaultValue: new File([], "empty.txt", { type: 'text/plain' }),
        },
    ],
    valueType: 'string',
    tooltip: '获取文件的DataURL，传入文件对象，不是文件对象会默认使用选择的文件对象',
})
Widget.prototype.getDataUrl = async function (file) {
    if (typeof file == 'string') {
        file = this.File();
    }
    if (!file) {
        return null;
    }
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        }
        reader.onerror = function (error) {
            reject(error);
        }
    })
}

exports.types = types;
exports.widget = Widget;