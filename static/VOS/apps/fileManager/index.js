const tabs = [];
addEventListener("load", e => {
    console.log("fileManager loaded");
    API.postMessage({ type: "load" });
});