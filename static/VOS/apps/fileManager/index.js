addEventListener("load", e => {
    console.log("fileManager DOMContentLoaded");
    API.postMessage({ type: "setDrag" });
    newTab("Home", "/storage/share/");
})

function newTab(name, path) {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.innerHTML = `<span class="tab-name">${name}</span><br><span>${path}</span><button class="close">x</button>`;
    document.getElementById("tabs").appendChild(tab);
    console.log("newTab", name, path);
}