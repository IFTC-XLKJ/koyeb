console.log("start", parent, globalThis.parent, API);
const { AppWindow } = API;
const appWindow = new AppWindow();
appWindow.load(new URL("index.html", `inner-src:///data/apps/${API.appid}/`).toString().replaceAll("inner-src://", ""));