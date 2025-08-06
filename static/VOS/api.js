globalThis.API = {};
(async function () {
    API.system = true;
    API.appid = "cn.iftc.vos";
    API.createFile = async function (path, file) {
        checkSystem(API.system, API.appid, path);
        if (!path || typeof path !== "string") {
            throw new Error("Invalid path");
        }
        if (!file || !(file instanceof File)) {
            throw new Error("Invalid file");
        }
        const paths = path.split("/");
        const folderPath = formatPath(paths.slice(0, paths.length - 1)).join("/") + "/";
        console.log(folderPath);
        await API.createDirectory(folderPath);
        const existingFile = await db.files.get({ name: path, type: "file" });
        if (!existingFile) {
            await db.files.add({
                name: path,
                type: "file",
                size: file.size,
                lastModified: file.lastModified,
                file: file,
            });
        }
        return true;
    }
    API.createDirectory = async function (path) {
        checkSystem(API.system, API.appid, path);
        if (!path || typeof path !== "string") {
            throw new Error("Invalid path");
        }
        if (!path.endsWith("/")) path += "/";
        const paths = formatPath(path.split("/"));
        console.log(paths);
        for (let i = 1; i <= paths.length; i++) {
            const subPath = paths.slice(0, i).join("/");
            console.log(subPath);
            const dir = await db.files.get({ name: subPath, type: "directory" });
            if (!dir) {
                await db.files.add({
                    name: subPath,
                    type: "directory",
                    lastModified: Date.now(),
                });
            }
        }
        return true;
    }
    API.isDirectory = async function (path) {
        if (!path || typeof path !== "string") {
            throw new Error("Invalid path");
        }
        if (path.endsWith("/")) path = path.slice(0, -1);
        const file = await db.files.get({ name: path });
        return file && file.type === "directory";
    }
    API.exist = async function (path) {
        if (!path || typeof path !== "string") {
            throw new Error("Invalid path");
        }
        const file = await db.files.get({ name: path });
        return file !== undefined;
    }
    API.readFile = async function (path) {
        checkSystem(API.system, API.appid, path);
        if (!path || typeof path !== "string") {
            throw new Error("Invalid path");
        }
        const file = await db.files.get({ name: path, type: "file" });
        if (!file) {
            throw new Error(`File(${path}) not found`);
        }
        return setFileType(file.file);
    }
    API.writeFile = async function (path, file) {
        checkSystem(API.system, API.appid, path);
        if (!path || typeof path !== "string") {
            throw new Error("Invalid path");
        }
        if (!file || !(file instanceof File)) {
            throw new Error("Invalid file");
        }
        const isDir = API.isDirectory(path);
        if (isDir) {
            throw new Error("Cannot write to directory");
        }
        const f = await db.files.get({ name: path, type: "file" });
        if (!f) {
            await API.createFile(path, file);
            return true;
        }
        f.file = file;
        f.size = file.size;
        f.lastModified = Date.now();
        await db.files.put(f);
        return true;
    }
    API.AppWindow = class {
        #id;
        #name;
        #icon;
        #width;
        #height;
        #x;
        #y;
        get id() {
            return this.#id;
        }
        constructor(options) {
            const { name, icon, width = 800, height = 600, x = 100, y = 100 } = options || {};
            this.#id = `app-${Date.now()}`;
            this.#name = name || "New App";
            this.#icon = icon || "default-icon.png";
            this.#width = width;
            this.#height = height;
            this.#x = x;
            this.#y = y;
            this.createWindow();
            console.log(API);
        }
        createWindow() {
            const appWindow = document.createElement("iframe");
            appWindow.className = "app-window";
            appWindow.sandbox = "allow-same-origin allow-scripts";
            appWindow.style.width = `${this.#width}px`;
            appWindow.style.height = `${this.#height}px`;
            appWindow.style.position = "absolute";
            appWindow.style.left = `${this.#x}px`;
            appWindow.style.top = `${this.#y}px`;
            appWindow.style.transform = "scale(0)";
            this.appWindow = appWindow;
            document.getElementById("windows").appendChild(appWindow);
            anime.animate(appWindow, {
                scale: [0, 1],
                duration: 300,
                easing: "easeInOutQuad",
            })
        }
        async load(url) {
            if (url.startsWith("http://") || url.startsWith("https://")) {
                this.appWindow.src = url;
            } else {
                const appPath = new URL(url, `inner-src:///data/apps/${API.appid}/`).toString().replaceAll("inner-src://", "");
                const blob = API.readFile(appPath);
                const html = await blob.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                this.appWindow.contentDocument.head.innerHTML += doc.head.innerHTML;
                this.appWindow.contentDocument.body.innerHTML += doc.body.innerHTML;
            }
        }
        close() {
            anime.animate(appWindow, {
                scale: [1, 0],
                duration: 300,
                easing: "easeInOutQuad",
                complete: () => {
                    appWindow.remove();
                }
            })
        }
    }
    API.Notification = class {
    }
    function formatPath(paths) {
        const notallowed = ["\\", "/", ":", "*", "?", "<", ">", "|"];
        const newPaths = [""];
        paths.forEach(path => {
            if (path == "") return;
            if (notallowed.some(char => path.includes(char))) {
                throw new Error("Invalid path. Not Allowed: " + JSON.stringify(notallowed));
            }
            newPaths.push(path);
        });
        return newPaths;
    }
    function checkSystem(system, appid, path) {
        if (!system) {
            if (!path.startsWith("/storage/share/") || !path.startsWith(`/data/data/${appid}/` || !path.startsWith(`/data/apps/${appid}/`))) {
                throw new Error("Cannot access path: " + path);
            }
        }
    }
    function changeFileTypeToBlob(file, newType) {
        const blob = new Blob([file], { type: newType });
        return new File([blob], file.name, {
            type: newType,
            lastModified: file.lastModified
        });
    }
    function setFileType(file) {
        const fileName = file.name.toLowerCase();
        let mimeType = 'application/octet-stream';
        if (fileName.endsWith('.txt')) {
            mimeType = 'text/plain';
        } else if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
            mimeType = 'text/html';
        } else if (fileName.endsWith('.css')) {
            mimeType = 'text/css';
        } else if (fileName.endsWith('.js')) {
            mimeType = 'application/javascript';
        } else if (fileName.endsWith('.json')) {
            mimeType = 'application/json';
        } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
            mimeType = 'image/jpeg';
        } else if (fileName.endsWith('.png')) {
            mimeType = 'image/png';
        } else if (fileName.endsWith('.gif')) {
            mimeType = 'image/gif';
        } else if (fileName.endsWith('.svg')) {
            mimeType = 'image/svg+xml';
        } else if (fileName.endsWith('.webp')) {
            mimeType = 'image/webp';
        } else if (fileName.endsWith('.mp3')) {
            mimeType = 'audio/mpeg';
        } else if (fileName.endsWith('.wav')) {
            mimeType = 'audio/wav';
        } else if (fileName.endsWith('.mp4')) {
            mimeType = 'video/mp4';
        } else if (fileName.endsWith('.webm')) {
            mimeType = 'video/webm';
        } else if (fileName.endsWith('.pdf')) {
            mimeType = 'application/pdf';
        } else if (fileName.endsWith('.zip')) {
            mimeType = 'application/zip';
        } else if (fileName.endsWith('.rar')) {
            mimeType = 'application/vnd.rar';
        } else if (fileName.endsWith('.7z')) {
            mimeType = 'application/x-7z-compressed';
        } else if (fileName.endsWith('.doc')) {
            mimeType = 'application/msword';
        } else if (fileName.endsWith('.docx')) {
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (fileName.endsWith('.xls')) {
            mimeType = 'application/vnd.ms-excel';
        } else if (fileName.endsWith('.xlsx')) {
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (fileName.endsWith('.ppt')) {
            mimeType = 'application/vnd.ms-powerpoint';
        } else if (fileName.endsWith('.pptx')) {
            mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        } else if (fileName.endsWith('.xml')) {
            mimeType = 'application/xml';
        } else if (fileName.endsWith('.csv')) {
            mimeType = 'text/csv';
        }
        return changeFileTypeToBlob(file, mimeType);
    }
})();