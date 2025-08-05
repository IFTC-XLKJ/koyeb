const db = new Dexie("VOS");

db.version(1).stores({
    files: '++id, name, type, size, lastModified, base64',
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

    globalThis.loadApp = async function () { }
    const systemApps = [
        { name: "fileManager", id: "cn.iftc.fileManager" }
    ];
    async function init() {
        console.log("Dexie:", db);
        const initialized = await db.user.get("initialized");
        if (initialized) {
            setTimeout(function () {
                const loadingSrc = document.getElementById('waitLoad');
                loadingSrc.style.display = "none";
            }, 200);
            return;
        }
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
                const { name, id, icon, main, description, author, versionName, versionCode } = manifest;
                const files = Object.keys(zip.files);
                files.forEach(file => {
                    
                })
            });
        }
    }
})();

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}