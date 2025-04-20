var { window, document } = this;
var { fetch, console } = window;

const METHOD_COLOR = '#1E90FF';
window.zip_task = {};
window.importScript = (src, load, error) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = load;
    script.onerror = error;
    document.head.appendChild(script);
}
window.genId = () => (Math.random() * (10 ** 16)).toString(36);

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
        },
        valueType: 'object',
    }],
    events: [{
        key: 'scriptLoad',
        label: '资源加载完成',
        params: [],
    }, {
        key: 'scriptErr',
        label: '资源加载失败',
        params: [],
    }],
};

class Widget extends InvisibleWidget {
    constructor(props) {
        super(props);
        importScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", () => this.emit("scriptLoad"), e => this.emit("scriptErr") || console.log(e) || this.widgetError(e.message));
    }
    async fetchAndUnzip(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);
            for (const [filename, file] of Object.entries(zip.files)) {
                if (!file.dir) {
                    const content = await file.async("string");
                    console.log(`File: ${filename}, Content: ${content}`);
                }
            }
        } catch (error) {
            console.error('Error fetching or unzipping the file:', error);
        }
    }
    async unzip(url) {
        const json = await this["fetchAndUnzip"](url);
    }
}

exports.types = types;
exports.widget = Widget;