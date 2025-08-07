console.log("start", parent, globalThis.parent, API);
const { AppWindow } = API;
const appWindow = new AppWindow({
    width: 1000,
});
appWindow.load(new URL("index.html", `inner-src:///data/apps/${API.appid}/`).toString().replaceAll("inner-src://", ""), {
    styles: [
        new URL("index.css", `inner-src:///data/apps/${API.appid}/`).toString().replaceAll("inner-src://", "")
    ],
    scripts: [
        new URL("index.js", `inner-src:///data/apps/${API.appid}/`).toString().replaceAll("inner-src://", "")
    ]
});
API.onmessage = (data) => {
    if (!data) return;
    if (data.type == "setDrag") {
        appWindow.setDragElement(appWindow.appWindow.contentDocument.querySelector("#nav"));
    }
}
const file = new API.File("/data/data/" + API.appid + "/abc.txt");
file.create();