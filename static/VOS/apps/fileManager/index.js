const tabs = [];
globalThis.onload = e => {
    console.log("fileManager DOMContentLoaded");
    API.postMessage({ type: "DOMContentLoaded" });
}