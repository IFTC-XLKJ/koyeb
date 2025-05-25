var { window, document } = this;
var { fetch, console } = window;

const METHOD_COLOR = '#1E90FF';

function importScript(src, load, error) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = load;
    script.onerror = error;
    document.head.appendChild(script);
}

globalThis.randomId = function () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
const types = {
    isInvisibleWidget: false,
    type: "TERMINAL",
    icon: "https://iftc.koyeb.app/static/terminal.svg",
    title: "虚拟终端",
    version: "1.0.0",
    isGlobalWidget: false,
    properties: [
        {
            key: '__width',
            label: '宽度',
            valueType: 'number',
            defaultValue: 360,
            blockOptions: {
                generateBlock: false,
            },
        },
        {
            key: '__height',
            label: '高度',
            valueType: 'number',
            defaultValue: 640,
            blockOptions: {
                generateBlock: false,
            },
        },
        {
            key: '__size',
            label: '',
            valueType: 'number',
            defaultValue: 0,
            readonly: true,
            blockOptions: {
                setter: {
                    keys: ['__height', '__width'],
                },
                getter: {
                    keys: ['__height', '__width'],
                },
            },
        },
    ],
    methods: [
        {
            key: 'isLoad',
            label: '是否加载完成',
            params: [],
            valueType: 'boolean',
            blockOptions: {
                callMethodLabel: false,
                color: METHOD_COLOR,
            },
        },
        {
            key: "write",
            label: "写入",
            params: [
                {
                    key: 'text',
                    label: '文本',
                    valueType: 'string',
                    defaultValue: 'Hello World',
                },
            ],
            blockOptions: {
                callMethodLabel: false,
                color: METHOD_COLOR,
            },
        }
    ],
    events: [],
};

class Widget extends VisibleWidget {
    constructor(props) {
        super(props);
        console.log(this)
        Object.assign(this, props);
        this.widgetId = randomId();
        this.id = this.widgetId + "_TERMINAL";
        this.terminal = null;
        console.log(this.__widgetId)
        // document.getElementById(this.__widgetId).innerHTML == `<div id=${this.widgetId + "_TERMINAL"}></div>`;
        importScript(
            "https://cdnjs.cloudflare.com/ajax/libs/xterm/5.5.0/xterm.js",
            () => {
                if (this.terminal) return;
                if (document.querySelector("#" + this.id + " .terminal")) return;
                this.terminal = new Terminal({
                    allowProposedApi: true,
                });
                setTimeout(() => {
                    console.log(document.getElementById(this.__widgetId))
                    this.terminal.open(document.getElementById(this.__widgetId));
                }, 1000)
                console.log(this.terminal);
            },
            () => {
                console.error("Failed to load xterm.js");
            }
        );
        importScript(
            "https://iftc.koyeb.app/static/xterm-addon-fit.js",
            () => {
                this.fitAddon = new FitAddon.FitAddon();
                this.terminal.loadAddon(this.fitAddon);
                this.fitAddon.fit();
            },
            () => {
                console.error("Failed to load xterm.js");
                this.widgetError("加载 xterm-addon-fit.js 失败");
            }
        );
        window[this.widgetId] = this;
    }
    render() {
        return (<></>);
    }
    isLoad() {
        return !!this.terminal;
    }
    write(text) {
        if (this.terminal) this.terminal.write(text);
        else this.widgetWarn("终端未初始化完成");
    }
}

exports.types = types;
exports.widget = Widget;