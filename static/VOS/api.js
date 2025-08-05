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
        for (let i = 1; i < paths.length; i++) {
            const subPath = paths.slice(0, i).join("/");
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