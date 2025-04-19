const path = require("path");
const fs = require("fs").promises;

class Other {
    constructor(app) {
        this.app = app;
        this.app.get("/file/blockly/workspace-serach", async (req, res) => {
            const content = await this.getFile("node_modules/@blockly/plugin-workspace-search/dist/index.js");
            if (content) {
                res.set({
                    "Content-Type": "text/javascript",
                });
                res.send(content);
            } else {
                res.status(500).send(null);
            }
        });
    }
    async getFile(path) {
        try {
            const content = await fs.readFile(path, "utf-8");
            return content;
        } catch(e) {
            console.error(e);
            return null;
        }
    }
}

module.exports = Other;