const tabs = [];
console.log("fileManager loaded");
onload = e => {
    API.postMessage({ type: "load" })
};