addEventListener("load", e => {
    console.log("fileManager DOMContentLoaded");
    try {
        API.postMessage({ type: "setDrag" });
        newTab("Home", "/storage/share/");
    } catch (error) {
        console.error("Error in load event:", error);
    }
})

function newTab(name, path) {
    try {
        const tab = document.createElement("div");
        tab.className = "tab";
        tab.innerHTML = `<span class="tab-name">${name}</span><br><span>${path}</span><button class="close">x</button>`;

        const tabsContainer = document.getElementById("tabs");
        if (!tabsContainer) {
            console.error("Tabs container not found");
            return;
        }
        tabsContainer.appendChild(tab);
        console.log("newTab", name, path);
    } catch (error) {
        console.error("Error creating tab:", error);
    }
}