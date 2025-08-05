const db = new Dexie("VOS");

db.version(1).stores({
    files: '++id, name, type, size, lastModified, base64',
    user: 'key, value',
    apps: 'id, name, path, mode, self-start',
});

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
        await db.user.add({ key: "initialized", value: true });
        setTimeout(function () {
            const loadingSrc = document.getElementById('waitLoad');
            loadingSrc.style.display = "none";
        }, 200);
        function loadSystemApps() {
            systemApps.forEach(async app => {
                const app = await db.app.get(app);
            });
        }
    }
})();

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}