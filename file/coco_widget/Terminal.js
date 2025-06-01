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
                    label: '',
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
        console.log(this.__widgetId);
        this.widget = document.getElementById(this.__widgetId);
        console.log(this.widget);
        if (this.widget) {
            if (!this.widget.shadowRoot) this.widget.attachShadow({ mode: 'open' })
        };
        // document.getElementById(this.__widgetId).innerHTML == `<div id=${this.widgetId + "_TERMINAL"}></div>`;
        importScript(
            "https://cdnjs.cloudflare.com/ajax/libs/xterm/5.5.0/xterm.js",
            () => {
                const that = this;
                async function start() {
                    that.widget = document.getElementById(that.__widgetId);
                    console.log(that.widget);
                    if (that.widget) {
                        if (!that.widget.shadowRoot) that.widget.attachShadow({ mode: 'open' })
                    } else {
                        that.widget = document.getElementById(that.__widgetId);
                        if (!that.widget) {
                            await wait(1000);
                            start();
                            return;
                        }
                    };
                    console.log(that.widget.shadowRoot)
                    if (that.terminal) return;
                    console.log(that.widget.shadowRoot.children);
                    if (that.widget.shadowRoot.children > 0) return;
                    that.terminal = new Terminal({
                        allowProposedApi: true,
                    });
                    setTimeout(() => {
                        console.log(that.widget.shadowRoot)
                        this.terminal.open(that.widget.shadowRoot);
                    }, 1000)
                    console.log(that.terminal);
                }
            },
            () => {
                console.error("Failed to load xterm.js");
            }
        );
        importScript(
            "https://iftc.koyeb.app/static/xterm-addon-fit.js",
            async () => {
                this.fitAddon = new FitAddon.FitAddon();
                await waitUntil(() => { return this.isLoad() });
                this.terminal.loadAddon(this.fitAddon);
                this.fitAddon.fit();
            },
            () => {
                console.error("Failed to load xterm.js");
                this.widgetError("加载 xterm-addon-fit.js 失败");
            }
        );
        window[this.widgetId] = this;
        // setInterval(() => {
        //     const terminals = document.querySelectorAll("UNSAFE_EXTENSION_TERMINAL_M0RArlx3X .terminal");
        //     if (terminals.length == 1) return;
        //     terminals.forEach((terminal, index) => {
        //         if (index == 0) return;
        //         terminal.remove();
        //     });
        // }, 100);
    }
    render() {
        if (this.widget && this.widget.shadowRoot) {
            const xtermViewport = this.widget.shadowRoot.querySelector(".xterm-viewport")
            if (xtermViewport) {
                xtermViewport.style.height = `${this.__height}px`;
                xtermViewport.style.width = `${this.__width}px`;
            }
        }
        return (<></>);
    }
    isLoad() {
        return !!this.terminal;
    }
    write(text) {
        if (this.terminal) this.terminal.write(text) || console.log(text);
        else this.widgetWarn("终端未初始化完成");
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitUntil(condition) {
    return new Promise((resolve, reject) => {
        const checkCondition = setInterval(() => {
            try {
                if (condition()) {
                    resolve(true);
                    clearInterval(checkCondition);
                };
            } catch (e) {
                reject(e);
                clearInterval(checkCondition);
            }
        })
    });
}

exports.types = types;
exports.widget = Widget;