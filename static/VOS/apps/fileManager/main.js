console.log("start", parent, globalThis.parent, API);
const { AppWindow } = API;
const appWindow = new AppWindow({
    appid: "cn.iftc.filemanager",
});
appWindow.load(new URL("index.html", `inner-src:///data/apps/${API.appid}/`).toString().replaceAll("inner-src://", ""));
API.createFile("/data/data/abc")