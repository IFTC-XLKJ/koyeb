async function(req, res) {
    res.json({
        code: 200,
        msg: "ok",
        timestamp: Date.now(),
    });
}

module.exports = Other;