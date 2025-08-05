setTimeout(function () {
    const loadingSrc = document.getElementById('waitLoad');
    loadingSrc.style.display = "none";
}, 200);

async function init() {
    const db = new Dexie("VOS");
}