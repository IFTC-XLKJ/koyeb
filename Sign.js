const crypto = require("crypto");

// 获取签名
class getSign {
    constructor() { }

    get(data) {
        return sha256FromString(String(data));
    }
}

// 获取SHA256值
async function sha256FromString(text) {
    const hash = crypto.createHash("sha256");
    hash.update(text);
    const sha256sum = hash.digest("hex");
    return sha256sum
}
module.exports = getSign;