const db = new Dexie("VOS");

// 在打开数据库之前定义数据库结构
db.version(1).stores({
    files: '++id, name, type, size, lastModified, content',
    user: '++id, name, email, password, token'
});

(async function () {
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