async function handle(request) { // 主函数
    const response = new request.response({ // 创建响应对象
        code: 200,
        msg: "Hello World",
        method: request.method,
        headers: request.headers,
        body: request.body,
        query: request.query,
        timestamp: time(),
    }, {
        status: 200,
    });
    return response.json(); // 返回响应，添加return表示函数执行完毕
}

function time() {
    return Date.now();
}

module.exports = handle; // 导出主函数