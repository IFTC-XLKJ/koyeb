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

    async function init() {
        console.log("Dexie:", db);
        setTimeout(function () {
            const loadingSrc = document.getElementById('waitLoad');
            loadingSrc.style.display = "none";
        }, 200);
    }
})()