var { window, document } = this;
var { fetch, console } = window;

import * as THREE from 'three';

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
        this.scriptLoaded = () => {
            return false;
        }
        Object.assign(this, props);
        this._canvas = null;
        importScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", () => {
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