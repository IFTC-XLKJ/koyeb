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
        const AppPath = `${appPath}${id}/manifest.json`;
        const manifest = await API.readFile(AppPath);
        if (!manifest) {
            console.error("应用不存在或无法读取:", id);
            return;
        }
        const manifestData = JSON.parse(await manifest.text());
        const { name, icon, main } = manifestData;
        const iconPath = `${appPath}${id}/${icon}`;
        const iconBlob = await API.readFile(iconPath);
        const iconURL = URL.createObjectURL(iconBlob);
        const html = `<div class="app">
    <img class="app-icon" src="${iconURL}" draggable="false">
    <div class="app-title">${app.name}</div>
</div>`;
        apps += html;
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
        await initApps();
        await loadSystemApps();
        await db.user.add({ key: "initialized", value: true });
        setTimeout(function () {
            const loadingSrc = document.getElementById('waitLoad');
            loadingSrc.style.display = "none";
        }, 200);
        async function loadSystemApps() {
            systemApps.forEach(async systemApp => {
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
            });
        }
        async function initApps() {
            const apps = await db.apps.filter(app => !!app.id).toArray();
            for (const app of apps) {
                await loadApp(app.id);
            }
        }
    }
})();

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}