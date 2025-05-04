async function handle(request) {
    return new request.response(JSON.stringify({
        code: 200,
        msg: "Hello World",
        method: request.method,
    }), {
        status: 200,
});
}

module.exports = handle;