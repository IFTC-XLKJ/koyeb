

async function init() {
    const db = new Dexie("VOS");
    console.log("Dexie:", db);
    setTimeout(function () {
        const loadingSrc = document.getElementById('waitLoad');
        loadingSrc.style.display = "none";
    }, 200);
}

init();