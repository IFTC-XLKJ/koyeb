

async function init() {
    const db = new Dexie("VOS");
    console.log("Dexie:", db);
    setTimeout(function () {
        const loadingSrc = document.getElementById('waitLoad');
        loadingSrc.style.display = "none";
    }, 200);
}

init();

function tableExists(db, tableName) {
    return db.tables.some(table => table.name === tableName);
}