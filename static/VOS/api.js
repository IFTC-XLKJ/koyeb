globalThis.API = {};
(async function () {
    API.createFile = async function (path, content) {
        db.files.add({
            name: path,
            type: "file",
            size: content.length,
            lastModified: Date.now(),
            content: content
        });
    }
    API.createDirectory = async function (path) {
        db.files.add({
            name: path,
            type: "directory",
            size: 0,
            lastModified: Date.now(),
            content: []
        });
    }
})();