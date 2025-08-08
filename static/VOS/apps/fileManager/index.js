// const tabs = [];
addEventListener("load", e => {
    console.log("fileManager DOMContentLoaded");
    API.postMessage({ type: "setDrag" });
    // tabs.push({})
    newTab("Home", "/storage/share/");
})

function newTab(name, path) {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.innerHTML = `<span class="tab-name">${name}</span><br><span>${path}</span><button class="close">x</button>`;
    document.getElementById("tabs").appendChild(tab);
}