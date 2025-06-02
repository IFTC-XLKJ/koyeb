class 官方扩展 extends Ext {
    constructor(name) {
        super(name);
        console.log("官方扩展加载成功", name);
        console.log("访问", localStorage)
    }
}