console.log("start", parent, globalThis.parent, API);
const { AppWindow } = API;
const appWindow = new AppWindow();
appWindow.load("index.html");