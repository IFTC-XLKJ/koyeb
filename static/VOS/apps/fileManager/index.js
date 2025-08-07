const tabs = [];
addEventListener("load", e => {
    console.log("fileManager DOMContentLoaded");
    API.postMessage({ type: "setDrag", element: nav });
})