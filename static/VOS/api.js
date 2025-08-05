globalThis.API = {};
(async function () {
    API.createFile = async function (path, file) {
        if (!file || !(file instanceof File)) {
            throw new Error("Invalid file object");
        }
        const paths = path.split("/");
        const fileName = paths.pop();
        for (let i = 1; i < paths.length; i++) {
            const subPath = paths.slice(0, i).join("/");
            const dir = await db.files.get({ name: subPath, type: "directory" });
            if (!dir) {
                await db.files.add({ name: subPath, type: "directory" });
            }
        }
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
    }
})();