const tabs = [];
document.addEventListener("DOMContentLoaded", e => {
    console.log("fileManager DOMContentLoaded");
    API.postMessage({ type: "DOMContentLoaded" });
});