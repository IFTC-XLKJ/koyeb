async function handle(request) { // 主函数
    /* const fun = require(资源路径); */ // 引入资源
    const { tools } = request; // 工具
    const { pgdbs, DOMParser, console } = tools; // 点鸭数据表
    console.log(request, require, fetch);
    console.log("Hello World"); // 打印日志
    /* const table = new pgdbs(密钥); */ // 创建点鸭数据表对象，密钥如：LkduYVIN+ZUTpqJ20se4bcYnTx4M······qbVzwEZSUfOxQGfnmh8Yo15DuJZVFC0=
    console.log(tools, "pgdbs", pgdbs, "DOMParser", DOMParser);
    const response = new request.response({
        code: 200,
        msg: "Hello World",
        method: request.method, // 请求方法
        headers: request.headers, // 请求头
        body: request.body, // 请求体
        query: request.query, // 请求参数
        UUID: request.UUID, // 此云函数的UUID
        timestamp: time(),
    }, {
        status: 200,
    }); // 创建响应对象
    return response.json(); // 返回响应，添加return表示函数执行完毕
}

function time() {
    return Date.now();
}

module.exports = handle; // 导出主函数