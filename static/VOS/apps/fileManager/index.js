// const tabs = [];
addEventListener("load", e => {
    console.log("fileManager DOMContentLoaded");
    API.postMessage({ type: "setDrag" });
    // tabs.push({})
})

function newTab(name, path) {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.innerHTML = `<span>${name}</span><button class="close">x</button>`;
}