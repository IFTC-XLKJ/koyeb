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

    globalThis.loadApp = async function () {}

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
    }
})();

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}