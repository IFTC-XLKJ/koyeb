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
    methods: [{
        key: "getLoadSourceNames",
        label: "获取加载的资源",
        params: [],
        valueType: "array",
    }, {
        key: "loadModel",
        label: "加载模型",
        params: [{
            key: 'url',
            label: 'URL',
            valueType: 'string',
            defaultValue: "https://iftc.koyeb.app/file/coco_widget/test/LittlestTokyo.glb",
        }, {
            key: 'scale',
            label: '缩放',
            valueType: 'number',
            defaultValue: 1,
        }]
    }],
    events: [],
};

class Widget extends VisibleWidget {
    constructor(props) {
        super(props);
        this.loadSourceNames = [];
        this.scriptLoaded = () => {
            return false;
        }
        Object.assign(this, props);
        this._canvas = document.createElement("canvas");
        this._canvas.setAttribute("iftc-id", "threejs-canvas");
        this._canvas.style.width = this.__width + "px";
        this._canvas.style.height = this.__height + "px";
        console.log(this.__widgetId, this.__widget)
        const add = setInterval(() => {
            this.__widget = document.querySelector(`#${this.__widgetId}`)
            if (this.__widget) {
                clearInterval(add);
                if (this.__widget.querySelector("[iftc-id='threejs-canvas']")) return;
                this.__widget.appendChild(this._canvas);
            }
        }, 100);
        importScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", () => {
            this.loadSourceNames.push("THREE");
            console.log(this)
            console.log(this.__widgetId, THREE);
            window.Three[this.__widgetId] = {};
            window.Three[this.__widgetId].scene = new THREE.Scene();
            window.Three[this.__widgetId].camera = new THREE.PerspectiveCamera(75, this.__width / this.__height, 0.1, 1000);
            window.Three[this.__widgetId].renderer = new THREE.WebGLRenderer({
                canvas: this._canvas,
            });
            window.Three[this.__widgetId].camera.position.set(0, 1, 2);
            console.log(window.Three);
            this.emit("scriptLoad");
            this.scriptLoaded = () => {
                return true;
            };
        }, e => this.emit("scriptErr") || console.log(e) || this.widgetError(e.message));
        importScript("https://iftc.koyeb.app/file/threejs/addons/loaders/GLTFLoader.js", () => {
            this.loadSourceNames.push("GLTFLoader");
        }, e => this.emit("scriptErr") || console.log(e) || this.widgetError(e.message));
        importScript("https://iftc.koyeb.app/file/threejs/addons/loaders/DRACOLoader.js", () => {
            this.loadSourceNames.push("DRACOLoader");
        }, e => this.emit("scriptErr") || console.log(e) || this.widgetError(e.message));
    }
    getLoadSourceNames() {
        return this.loadSourceNames;
    }
    loadModel(url, scale) {
        return new Promise((resolve, reject) => {
            if (!this.scriptLoaded()) {
                return reject("script not loaded");
            }
            if (!window.Three[this.__widgetId]) {
                return reject("THREE not loaded");
            }
            if (!window.Three[this.__widgetId].scene) {
                return reject("THREE scene not loaded");
            }
            if (!window.Three[this.__widgetId].camera) {
                return reject("THREE camera not loaded");
            }
            if (!window.Three[this.__widgetId].renderer) {
                return reject("THREE renderer not loaded");
            }
            const dracoLoader = new THREE.DRACOLoader();
            dracoLoader.setDecoderPath('/draco/');
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
            const loader = new THREE.GLTFLoader();
            loader.setDRACOLoader(dracoLoader);
            loader.load(url,
<<<<<<< HEAD
                (gltf) => {
                    window.Three[this.__widget].scene.add(gltf.scene);
=======
                gltf => {
                    const model = gltf.scene;
                    model.scale.set(scale, scale, scale);
                    window.Three[this.__widgetId].scene.add(model);
                    window.Three[this.__widgetId].renderer.setSize(this.__width, this.__height);
                    window.Three[this.__widgetId].renderer.render(window.Three[this.__widgetId].scene, window.Three[this.__widgetId].camera);
                    resolve(model);
>>>>>>> 5562c7831b842fc8a2401bf0ce11e7c2c71050f5
                },
                xhr => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                error => {
                    console.log('An error happened', error);
                    reject(error.message)
                }
            )
        })
    }
    render() {
        return (<></>);
    }
}

exports.types = types;
exports.widget = Widget;