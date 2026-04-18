import crypto from "crypto";

class getSign {
    constructor() {}
    get(data: string): Promise<string> {
        return sha256FromString(String(data));
    }
}
async function sha256FromString(text: string): Promise<string> {
    const hash: crypto.Hash = crypto.createHash("sha256");
    hash.update(text);
    const sha256sum: string = hash.digest("hex");
    return sha256sum;
}

export default getSign;
