class CoDrive {
    baseUrl = 'https://drive.amethyst.ltd/api/v4';
    token = '';
    email = 'iftcceo@139.com';
    pwd = 'stree123456';
    expires = 0;
    constructor() {
        setInterval(async () => {
            const now = Date.now();
            if (now < this.expires) return;
            const json = await this.fetchData('/session/token', 'POST', JSON.stringify({
                email: this.email,
                password: this.pwd,
            }));
            if (json.code != 0) return;
            const token = json.data.token.access_token;
            const expires = json.data.token.access_expires;
            this.token = token;
            this.expires = Date.parse(expires);
        },
            30000);
    }
    async fetchData(path,
        method,
        _raw,
        contentType = "application/json") {
        console.log(this.token);
        const headers = new Headers();
        headers.append("Content-Type",
            contentType);
        headers.append("Authorization",
            `Bearer ${this.token}`)
        const raw = _raw;
        console.log(raw);
        const requestOptions = {
            method: method,
            headers: headers,
            body: method == 'GET' ? void 0: raw,
            redirect: 'follow'
        };
        const r = await fetch(`${this.baseUrl}${path}`,
            requestOptions);
        const j = await r.json();
        console.log('CoDrive',
            j);
        return j;
    }
    start(app) {
        app.get("/api/cloud/filelist",
            async (req, res) => {
                const {
                    uri,
                    page,
                    pagesize
                } = req.query;
                const json = await this.fetchData(`/file?uri=${`cloudreve://my${decodeURIComponent(uri)}`}&page=${page}&page_size=${pagesize}`, "GET");
                return res.json(json);
            });
        app.get("/api/cloud/createfile",
            async (req, res) => {
                const {
                    uri,
                    type
                } = req.query;
                const json = await this.createFile(uri, type);
                return res.json(json);
            });
        app.get("/api/cloud/getfile",
            async (req, res)=> {
                const {
                    uri
                } = req.query;
                const r = await this.getFile(uri);
                if (r.error) return res.send(r.error);
                const buffer = Buffer.from(await r.file.arrayBuffer());
                console.log(buffer);
                res.set("Content-Type", r.contentType);
                res.set("Content-Length", r.file.length);
                res.set('Content-Disposition', `attachment; filename="${uri.split('/')[uri.split('/').length - 1]}"`);
                return res.send(buffer);
            });
        app.post("/api/cloud/upload-avatar",
            async (req, res)=> {
                console.log(req.body, req.body.length);
                if (!req.body) return res.status(400).json({
                    code: 400,
                    msg: "缺少文件",
                    timestamp: Date.now()
                });
                const size = req.body.length;
                if (size > 5 * 1024 * 1024) return res.status(413).json({
                    code: 413,
                    msg: '最大5MB',
                    timestamp: Date.now()
                });
                const {
                    id
                } = req.query;
                //const { fields, files } = parseFormData(req.body, req.get("Content-Type"));
                console.log(id);
                return res.send(JSON.stringify({
                    message: 'FormData received'
                }));
            });
    }
    async createFile(uri,
        type) {
        const json = await this.fetchData("/file/create",
            "POST",
            JSON.stringify({
                uri: `cloudreve://my${uri}`,
                type: type
            }));
        return json;
    }
    async getFile(uri) {
        const json = await this.fetchData("/file/url",
            "POST",
            JSON.stringify({
                uris: [
                    `cloudreve://my${uri}`
                ],
            }));
        console.log(json);
        if (json.code != 0) return {
            error: json.error || json.msg
        };
        const url = json.data.urls[0].url;
        console.log(url);
        const r = await fetch(url);
        const contentType = r.headers.get("Content-Type");
        console.log(contentType);
        const blob = await r.blob();
        console.log(blob, blob.type);
        return {
            file: blob,
            contentType: contentType
        };
    }
}
function parseFormData(buf, contentType) {
    // 1. 提取 boundary
    const match = contentType.match(/boundary=(.+?)(;|$)/);
    if (!match) throw new Error('No boundary found');
    const boundary = '--' + match[1];
    const boundaryBuf = Buffer.from(boundary);

    // 2. 查找所有 boundary 的位置
    const parts = [];
    let start = 0;
    let index;

    while ((index = buf.indexOf(boundaryBuf, start)) !== -1) {
        parts.push(buf.slice(start, index));
        start = index + boundaryBuf.length;
    }

    // 最后一部分（末尾可能是 --\r\n）
    const lastPart = buf.slice(start);
    if (lastPart.length > 2) {
        // 排除结尾的 \r\n 或 --
        parts.push(lastPart);
    }

    // 去掉第一段（应该是空的）和最后一段（通常是 --\r\n）
    const dataParts = parts.slice(1, -1);

    const fields = {};
    const files = {};

    for (const part of dataParts) {
        if (part.length < 2) continue;

        // 找到头部和体部分隔符 \r\n\r\n
        const endOfHeaderIndex = part.indexOf('\r\n\r\n');
        if (endOfHeaderIndex === -1) continue;

        const headerBuf = part.slice(0, endOfHeaderIndex);
        const bodyBuf = part.slice(endOfHeaderIndex + 4); // +4 是 \r\n\r\n 长度

        const headerStr = headerBuf.toString();

        // 解析 Content-Disposition 头部
        const disposition = headerStr.match(/Content-Disposition: form-data; (.+)/i);
        if (!disposition) continue;

        const attrs = {};
        // 简单解析 name 和 filename
        const re = /(\w+)="([^"]*)"/g;
        let m;
        while ((m = re.exec(disposition[1]))) {
            attrs[m[1]] = m[2];
        }

        if (attrs.filename) {
            // 是文件
            files[attrs.name] = {
                filename: attrs.filename,
                data: Buffer.from(bodyBuf),
                // 文件内容（去掉末尾 \r\n）
                size: bodyBuf.length,
            };
        } else {
            // 普通字段
            fields[attrs.name] = bodyBuf.toString().trim(); // 移除 \r\n
        }
    }

    return {
        fields,
        files
    };
}


module.exports = CoDrive;