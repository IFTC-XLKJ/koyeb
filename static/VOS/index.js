const db = new Dexie("VOS");

db.version(1).stores({
    files: '++id, name, type, size, lastModified, file',
    user: 'key, value',
    apps: 'id, name, path, mode, self_start',
});

const appPath = "/data/apps/";

class Errors extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
        this.message = message;
    }
}

globalThis.deleteAll = async () => {
    return await Dexie.delete("VOS");
}
(async function () {
    addEventListener("contextmenu", function (e) {
        e.preventDefault();
    })
    try {
        await db.open();
        init();
    } catch (error) {
        console.error("数据库打开失败:", error);
    }
    globalThis.runningApps = [];
    globalThis.loadApp = async function (id) {
        const app = await db.apps.get(id);
        if (!app) return;
        const appManifestPath = `${appPath}${id}/manifest.json`;
        const manifest = await API.readFile(appManifestPath);
        if (!manifest) {
            console.error("应用不存在或无法读取:", id);
            return;
        }
        const manifestData = JSON.parse(await manifest.text());
        const { name, icon, description } = manifestData;
        const iconPath = `${appPath}${id}/${icon}`;
        const iconBlob = await API.readFile(iconPath);
        console.log("iconPath:", iconPath);
        console.log("iconBlob:", iconBlob);
        const reader = new FileReader();
        reader.onload = function () {
            const html = `<div class="app" title="${name}\n${description}" data-app-id="${id}">
    <img class="app-icon" src="${reader.result}" draggable="false">
    <div class="app-title">${name}</div>
</div>`;
            document.getElementById("apps").innerHTML += html;
            const appElement = document.querySelector(`.app[data-app-id="${id}"]`);
            appElement.addEventListener("dblclick", () => {
                console.log("app", id);
                startApp(id);
            });
            const self_start = app.self_start || false;
            if (self_start) {
                console.log("自动启动应用:", id);
                startApp(id);
            }
        }
        reader.readAsDataURL(iconBlob);
    }
    globalThis.installApp = async function (id, name, path, mode = "normal", self_start = false) {
        if (!name || !id || !path) {
            alert("请检查文件格式");
            return;
        }
        const app = await db.apps.get(id);
        if (app) {
            console.warn("应用已存在:", id);
            return;
        }
        await db.apps.add({
            id,
            name,
            path,
            mode,
            self_start
        });
    }
    globalThis.startApp = async function (id) {
        if (runningApps.some(app => app.id === id)) {
            console.warn("应用已在运行:", id);
            return;
        }
        const app = await db.apps.get(id);
        const appManifestPath = `${appPath}${id}/manifest.json`;
        const manifest = await API.readFile(appManifestPath);
        if (!manifest) {
            console.error("应用不存在或无法读取:", id);
            return;
        }
        const manifestData = JSON.parse(await manifest.text());
        const { main } = manifestData;
        const appPathWithMain = `${appPath}${id}/${main}`;
        const appBackstage = document.createElement("iframe");
        appBackstage.className = "app-backstage";
        appBackstage.dataset.appid = id;
        appBackstage.sandbox = "allow-same-origin allow-scripts";
        appBackstage.srcdoc = ``;
        appBackstage.addEventListener("load", async () => {
            const nativeFile = File;
            const AppWindow = appBackstage.contentWindow;
            appBackstage.contentWindow.API = {
                File: class {
                    constructor(path, base) {
                        if (!path) throw new Errors("FileError(init)", "File path cannot be empty");
                        try {
                            this.path = new URL(path, base ? `inner-src://${base}` : `inner-src:///data/apps/${AppWindow.API.appid}/`).toString().replaceAll("inner-src://", "");
                        } catch (e) {
                            throw new Errors("FileError(init)", e.message);
                        }
                    }
                    async create(isDirectory) {
                        const name = this.path.split("/").pop();
                        checkSystem(AppWindow.API.system, AppWindow.API.appid, this.path);
                        if (isDirectory) {
                            return await API.createDirectory(this.path);
                        } else {
                            return await API.createFile(this.path, new nativeFile([""], name, { type: "text/plain" }));
                        }
                    }
                    async write(data) {
                        checkSystem(AppWindow.API.system, AppWindow.API.appid, this.path);
                        if (await API.isDirectory(this.path)) {
                            throw new Errors("FileError(write)", "Cannot write to directory");
                        }
                        return await API.writeFile(this.path, data);
                    }
                    toFile(data, type) {
                        const name = this.path.split("/").pop();
                        if (data instanceof Blob || data instanceof ArrayBuffer || data instanceof Uint8Array || data instanceof String) {
                            return new nativeFile([data], name, type);
                        }
                        throw new Errors("FileError(toFile)", "Invalid argument")
                    }
                },
                AppWindow: class {
                    #id;
                    #name;
                    #icon;
                    #width;
                    #height;
                    #x;
                    #y;
                    get id() {
                        return this.#id;
                    }
                    constructor(options) {
                        console.log(options);
                        const { name, icon, width = 800, height = 600, x = 100, y = 100 } = options || {};
                        this.#id = `app-${Date.now()}`;
                        this.#name = name || "New App";
                        this.#icon = icon || "default-icon.png";
                        this.#width = width;
                        this.#height = height;
                        this.#x = x;
                        this.#y = y;
                        this.createWindow();
                        console.log(AppWindow.API);
                    }
                    createWindow() {
                        const appWindow = document.createElement("iframe");
                        appWindow.dataset.appid = AppWindow.API.appid;
                        appWindow.className = "app-window";
                        appWindow.sandbox = "allow-same-origin allow-scripts";
                        appWindow.style.width = `${this.#width}px`;
                        appWindow.style.height = `${this.#height}px`;
                        appWindow.style.position = "absolute";
                        appWindow.style.left = `${this.#x}px`;
                        appWindow.style.top = `${this.#y}px`;
                        appWindow.style.transform = "scale(0)";
                        appWindow.addEventListener("load", () => {
                            appWindow.contentWindow.API = AppWindow.API;
                            appWindow.contentWindow.addEventListener("contextmenu", (e) => {
                                e.preventDefault();
                            })
                            appWindow.contentDocument.head.appendChild(InnerSrcScript);
                            const script = document.createElement("script");
                            script.innerText = `var parent = null;`;
                            appWindow.contentWindow.API.postMessage = function (data) {
                                AppWindow.API.onmessage(data);
                            }
                            appWindow.contentDocument.head.appendChild(script);
                        });
                        this.appWindow = appWindow;
                        document.getElementById("windows").appendChild(appWindow);
                        anime.animate(appWindow, {
                            scale: [0, 1],
                            opacity: [0, 1],
                            duration: 300,
                            easing: "easeInOutQuad",
                        })
                    }
                    async load(url, src) {
                        const appWindow = this.appWindow;
                        const { styles, scripts } = src || {};
                        if (url.startsWith("http://") || url.startsWith("https://")) {
                            appWindow.src = url;
                        } else {
                            const appPath = new URL(url, `inner-src:///data/apps/${AppWindow.API.appid}/`).toString().replaceAll("inner-src://", "");;
                            const blob = await API.readFile(appPath);
                            console.log(blob);
                            const html = await blob.text();
                            const setter = setInterval(async () => {
                                if (appWindow.contentDocument) {
                                    for (const style of styles || []) {
                                        const stylePath = new URL(style, `inner-src:///data/apps/${AppWindow.API.appid}/`).toString().replaceAll("inner-src://", "");
                                        const styleBlob = await API.readFile(stylePath);
                                        const styleText = await styleBlob.text();
                                        const styleElement = document.createElement("style");
                                        styleElement.innerText = styleText;
                                        appWindow.contentDocument.head.appendChild(styleElement);
                                    }
                                    for (const script of scripts || []) {
                                        const scriptPath = new URL(script, `inner-src:///data/apps/${AppWindow.API.appid}/`).toString().replaceAll("inner-src://", "");
                                        const scriptBlob = await API.readFile(scriptPath);
                                        const scriptText = await scriptBlob.text();
                                        const scriptElement = document.createElement("script");
                                        scriptElement.innerText = scriptText;
                                        appWindow.contentDocument.head.appendChild(scriptElement);
                                    }
                                    appWindow.contentDocument.body.innerHTML += html;
                                    appWindow.contentWindow.dispatchEvent(new Event("load"));
                                    clearInterval(setter);
                                }
                            }, 100);
                        }
                    }
                    close() {
                        anime.animate(this.appWindow, {
                            scale: [1, 0],
                            opacity: [1, 0],
                            duration: 300,
                            easing: "easeInOutQuad",
                            complete: () => {
                                setTimeout(() => {
                                    this.appWindow.remove();
                                }, 300);
                            }
                        })
                    }
                    dragElements = [];
                    getDragElements() {
                        return this.dragElements;
                    }
                    removeDragElement(element) {
                        if (!element || typeof element.nodeType !== 'number' || element.nodeType !== 1) {
                            throw new Errors("AppWindowError(removeDragElement)", "Element must be an instance of HTMLElement");
                        }
                        this.dragElements = this.dragElements.filter(e => e !== element);
                        element.removeEventListener("mousedown", this.#setDrag);
                        element.style.cursor = "default";
                    }
                    setDragElement(element) {
                        if (!element || typeof element.nodeType !== 'number' || element.nodeType !== 1) {
                            throw new Errors("AppWindowError(setDragElement)", "Element must be an instance of HTMLElement");
                        }
                        this.dragElements.push(element);
                        element.addEventListener("mousedown", this.#setDrag);
                        element.style.cursor = "move";
                    }
                    #setDrag = (e) => {
                        console.log("按下");
                        let isDragging = true;
                        const dragElement = e.target;
                        const position = { x: e.clientX, y: e.clientY };
                        console.log(position);
                        let moving = false;
                        const handleMouseMove = (event) => {
                            if (isDragging) {
                                const appWindow = this.appWindow;
                                if (appWindow && !moving) {
                                    moving = true;
                                    console.log("移动");
                                    const { x, y } = appWindow.getBoundingClientRect();
                                    console.log(x, y);
                                    const dx = event.clientX - position.x;
                                    const dy = event.clientY - position.y;
                                    console.log("移动", dx, dy);
                                    appWindow.style.left = `${x + dx}px`;
                                    appWindow.style.top = `${y + dy}px`;
                                    position.x = event.clientX;
                                    position.y = event.clientY;
                                    moving = false;
                                }
                            }
                        };

                        const handleMouseUp = () => {
                            console.log("结束")
                            isDragging = false;
                            dragElement.removeEventListener("mousemove", handleMouseMove);
                            dragElement.removeEventListener("mouseup", handleMouseUp);
                        };

                        dragElement.addEventListener("mousemove", handleMouseMove);
                        dragElement.addEventListener("mouseup", handleMouseUp);
                    }
                    postMessage(data) {
                    }
                },
                onmessage: null,
                exit: function () {
                    appBackstage.remove();
                    const iframes = document.querySelectorAll(`iframe[data-appid="${id}"]`);
                    for (const iframe of iframes) {
                        anime.animate(iframe, {
                            scale: [1, 0],
                            opacity: [1, 0],
                            duration: 300,
                            easing: "easeInOutQuad",
                            complete: () => {
                                setTimeout(() => {
                                    iframe.remove();
                                }, 300);
                            }
                        });
                    }
                    runningApps = runningApps.filter(item => item.id !== id);
                }
            };
            Object.defineProperty(appBackstage.contentWindow.API, "system", {
                value: false,
                writable: false,
                configurable: false,
                enumerable: true
            });
            Object.defineProperty(appBackstage.contentWindow.API, "appid", {
                value: id,
                writable: false,
                configurable: false,
                enumerable: true
            });
            Object.defineProperty(appBackstage.contentWindow, "localStorage", {
                value: null,
                writable: false,
                configurable: false,
                enumerable: true
            });
            Object.defineProperty(appBackstage.contentWindow, "parent", {
                value: null,
                writable: false,
                configurable: false,
                enumerable: true
            });
            appBackstage.contentWindow.parent = null;
            appBackstage.contentDocument.head.appendChild(InnerSrcScript);
            const script = document.createElement("script");
            script.innerText = `var parent = null;`;
            appBackstage.contentDocument.head.appendChild(script);
            const mainScript = document.createElement("script");
            const mainScriptBlob = await API.readFile(appPathWithMain);
            const reader = new FileReader();
            reader.onload = function () {
                mainScript.src = reader.result;
                appBackstage.contentDocument.body.appendChild(mainScript);
            }
            reader.readAsDataURL(mainScriptBlob);
            appBackstage.contentDocument.body.appendChild(mainScript);
        });
        appBackstage.style.display = "none";
        document.getElementById("windows").appendChild(appBackstage);
        runningApps.push({
            id,
            app: appBackstage,
        });
        function checkSystem(system, appid, path) {
            if (!system) {
                if (!path.startsWith("/storage/share/") || !path.startsWith(`/data/data/${AppWindow.API.appid}/` || !path.startsWith(`/data/apps/${AppWindow.API.appid}/`))) {
                    throw new Errors("AccessDeniedError", "Cannot access path: " + path);
                }
            }
        }
    }
    const systemApps = [
        { name: "fileManager", id: "cn.iftc.fileManager" }
    ];
    async function init() {
        console.log("Dexie:", db);
        const initialized = await db.user.get("initialized");
        if (initialized) {
            await initApps();
            setTimeout(function () {
                const loadingSrc = document.getElementById('waitLoad');
                loadingSrc.style.display = "none";
            }, 200);
            return;
        }
        await loadSystemApps();
        await wait(1000);
        await db.user.add({ key: "initialized", value: true });
        setTimeout(function () {
            const loadingSrc = document.getElementById('waitLoad');
            loadingSrc.style.display = "none";
        }, 200);
        async function loadSystemApps() {
            return new Promise(async (resolve, reject) => {
                systemApps.forEach(async (systemApp, index) => {
                    const app = await db.apps.get(systemApp.id);
                    console.log(app);
                    if (app) return;
                    const url = `https://iftc.koyeb.app/static/VOS/apps/${systemApp.name}.zip`;
                    const r = await fetch(url);
                    const blob = await r.blob();
                    const zip = await JSZip.loadAsync(blob);
                    console.log(zip);
                    const manifest = JSON.parse(await zip.file("manifest.json").async("text"));
                    console.log(manifest);
                    const { name, id, main } = manifest;
                    const files = Object.keys(zip.files);
                    for await (const fileName of files) {
                        const file = new File([await zip.file(fileName).async("blob")], fileName);
                        await API.createFile(appPath + id + "/" + fileName, file);
                        await wait(10); // 防止 Dexie 的事务冲突
                    }
                    await installApp(id, name, `${appPath}${id}/${main}`, "normal");
                    await wait(10);
                    if (index == systemApps.length - 1) {
                        await initApps();
                        resolve();
                    };
                });
            });
        }
        async function initApps() {
            const innerSrcElementR = await fetch("/static/VOS/InnerSrc.js");
            const innerSrcElementText = await innerSrcElementR.text();
            const script = document.createElement("script");
            script.textContent = innerSrcElementText;
            globalThis.InnerSrcScript = script;
            const apps = await db.apps.filter(app => !!app.id).toArray();
            console.log(apps)
            for (const app of apps) {
                console.log("正在初始化应用", app.id);
                await loadApp(app.id);
            }
        }
    }
})();

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i]);
        }
        return copy;
    }

    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}