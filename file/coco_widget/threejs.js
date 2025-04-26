var { window, document } = this;
var { fetch, console } = window;

if (!window.Three) {
    window.Three = {};
}

const METHOD_COLOR = '#1E90FF';
const ICONS = [
    "https://iftc.koyeb.app/static/three-favicon.ico",
    "https://iftc.koyeb.app/static/three-favicon_white.ico",
]
function importScript(src, load, error) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = load;
    script.onerror = error;
    document.head.appendChild(script);
}

const types = {
    isInvisibleWidget: false,
    type: "THREEJS",
    icon: ICONS[0],
    title: "ThreeJS",
    varsion: "1.0.0",
    author: "IFTC",
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
    methods: [],
    events: [],
};

class Widget extends VisibleWidget {
    constructor(props) {
        super(props);
        console.log(this)
        this.scriptLoaded = () => {
            return false;
        }
        Object.assign(this, props);
        this._canvas = null;
        importScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", () => {
            console.log(this.__widgetId, THREE);
            window.Three[this.__widgetId] = {};
            window.Three[this.__widgetId].scene = new THREE.Scene();
            window.Three[this.__widgetId].camera = new THREE.PerspectiveCamera(75, this.__width / this.__height, 0.1, 1000);
            window.Three[this.__widgetId].renderer = new THREE.WebGLRenderer({
                canvas: document.querySelector(`#${this.__widgetId} [iftc-id='threejs-canvas']`),
            });
            this.emit("scriptLoad");
            this.scriptLoaded = () => {
                return true;
            };
        }, e => this.emit("scriptErr") || console.log(e) || this.widgetError(e.message));
    }
    render() {
        return (
            <canvas iftc-id="threejs-canvas" style={{
                width: this.__width + "px",
                height: this.__height + "px",
            }}></canvas>
        );
    }
}

exports.types = types;
exports.widget = Widget;