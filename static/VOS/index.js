const db = new Dexie("VOS");

async function init() {
    console.log("Dexie:", db);
    db.on('ready', () => {
        if (!tableExists(db, 'files')) db.version(1).stores({
            files: '++id, name, type, size, lastModified, content'
        });
        if (!tableExists(db, "user")) db.version(1).stores({
            user: '++id, name, email, password, token'
        });
    });
    setTimeout(function () {
        const loadingSrc = document.getElementById('waitLoad');
        loadingSrc.style.display = "none";
    }, 200);
}

init();

function tableExists(db, tableName) {
    return db.tables.some(table => table.name === tableName);
}