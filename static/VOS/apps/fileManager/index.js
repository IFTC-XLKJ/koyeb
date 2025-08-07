const tabs = [];
onload = e => {
    console.log("fileManager loaded");
    API.postMessage({ type: "load" })
};