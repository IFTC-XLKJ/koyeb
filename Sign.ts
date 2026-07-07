import crypto from "crypto";

class getSign {
    constructor() {}
    get(data: string): string {
        const hash: crypto.Hash = crypto.createHash("sha256");
        hash.update(String(data));
        return hash.digest("hex");
    }
}

export default getSign;