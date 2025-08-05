const db = new Dexie("VOS");

db.version(1).stores({
    files: '++id, name, type, size, lastModified, base64',
    user: 'key, value'
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
        {
            id: "cn.iftc.fileManager",
            name: "文件管理器",
            icon: "static/VOS/apps/fileManager/icon.png",
            entry: "static/VOS/apps/fileManager/index.html",
        },
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
        function loadSystemApps() {}
    }
})();

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}