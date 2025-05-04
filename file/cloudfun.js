async function handle(request) {
    return new request.response(JSON.stringify({
        code: 200,
        msg: "Hello World",
        method: request.method,
        headers: request.headers,
        body: request.body,
        timestamp: time(),
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

function time() {
    return Date.now();
}

module.exports = handle;