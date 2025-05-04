async function handle(request) {
    const response = new request.response({
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
    return response.json();
}

function time() {
    return Date.now();
}

module.exports = handle;