const db = new Dexie("VOS");

db.version(1).stores({
    files: '++id, name, type, size, lastModified, file',
    user: 'key, value',
    apps: 'id, name, path, mode, self_start',
});

const appPath = "/data/apps/";

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
        appBackstage.sandbox = "allow-same-origin allow-scripts";
        appBackstage.srcdoc = ``;
        appBackstage.addEventListener("load", async () => {
            appBackstage.contentWindow.API = API;
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
        runningApps.push(window);
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