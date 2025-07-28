globalThis.loadCustomExt = async function (obj) {
    if (obj instanceof Object) {
        const { types } = obj;
        if (types instanceof Object) {
            const { name, color, version, author, blocks } = types;
            let exit = false;
            for (const content of toolbox.contents) {
                if (content.kind == "category" && content.name == name) {
                    if (!confirm("是否覆盖 " + name + " ?")) {
                        exit = true;
                        break;
                    }
                }
            }
            if (exit) return;
            toolbox.contents.push({
                kind: "category",
                name: name,
                colour: color,
                contents: blocks
            });
            workspace.updateToolbox(toolbox);
        } else {
            alert("无法加载扩展，请检查扩展导出的格式是否正确");
        }
    } else {
        alert("无法加载扩展，请检查扩展导出的格式是否正确");
    }
}