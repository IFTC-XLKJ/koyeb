globalThis.API = {};
(async function () {
    API.createFile = async function (path, file) {
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
        if (!path || typeof path !== "string") {
            throw new Error("Invalid path");
        }
        const file = await db.files.get({ name: path, type: "file" });
        if (!file) {
            throw new Error("File not found");
        }
        return file.file;
    }
    API.writeFile = async function (path, file) {
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
})();