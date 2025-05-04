async function handle(request) { // 主函数
    console.log(request);
    const response = new request.response({
        code: 200,
        msg: "Hello World",
        method: request.method,
        headers: request.headers,
        body: request.body,
        query: request.query,
        UUID: request.uuid,
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