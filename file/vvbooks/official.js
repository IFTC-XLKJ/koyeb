class 官方扩展 extends Ext {
    minTargetVersion = "test4-4";
    constructor(name) {
        super(name);
        console.log("官方扩展加载成功", name);
        console.log("访问", iftc);
        this.postMessage({
            type: "init",
            msg: "官方扩展加载成功",
        });
        this.extLog(0, "官方扩展加载成功", name);
    }
    onmessage(data) {
        console.log("官方扩展 onmessage", data);
    }
}