var { window, document } = this;

window.importScript = (src, load, error) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = load;
    script.onerror = error;
    document.head.appendChild(script);
}

const types = {
    isInvisibleWidget: true,
    type: "ZIP",
    icon: "https://iftc.koyeb.app/static/zip.svg",
    title: "压缩包",
    version: "1.0.0",
    isGlobalWidget: true,
    author: "IFTC",
    properties: [],
    methods: [],
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
        importScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", () => this.emit("scriptLoad"), e => this.emit("scriptErr") && console.log(e) && this.widgetError(e.message));
    }

}

exports.types = types;
exports.widget = Widget;