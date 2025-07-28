globalThis.loadCustomExt = async function (obj) {
    if (obj instanceof Object) {
        const { types } = obj;
        if (types instanceof Object) {
            const { name, version, author, blocks } = types;
            toolbox.contents.push({
                kind: "category",
                name: name,
                contents: blocks
            });
            workspace.updateToolbox(toolbox)
        } else {
            alert("无法加载扩展，请检查扩展导出的格式是否正确");
        }
    } else {
        alert("无法加载扩展，请检查扩展导出的格式是否正确");
    }
}