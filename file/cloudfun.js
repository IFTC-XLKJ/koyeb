async function handle(request) {
    return new request.response(JSON.stringify({
        code: 200,
        msg: "Hello World",
    }), {
        status: 200,
});
}

module.exports = handle;