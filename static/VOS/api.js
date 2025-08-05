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
        const folderPath = paths.slice(0, paths.length - 1).join("/");
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
    }
    API.createDirectory = async function (path) {
        if (!path || typeof path !== "string") {
            throw new Error("Invalid path");
        }
        const paths = path.split("/");
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
})();