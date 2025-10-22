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
        _raw) {
        console.log(this.token);
        const headers = new Headers();
        headers.append("Content-Type",
            "application/json");
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
        app.post("/api/cloud/upload-avatar", async (req,res)=>{
            console.log(req.body);
            const { fields, files } = parseFormData(req.body, req.get("Content-Type"));
            console.log(files.id, files.file);
            return res.send(JSON.stringify({ message: 'FormData received' }));
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
  const boundary = '--' + contentType.match(/boundary=(.+?)(;|$)/)[1];
  const parts = buf.split(boundary).slice(1, -1); // 去掉首尾空段

  const fields = {};
  const files = {};

  for (const part of parts) {
    const [head, ...body] = part.trim().split('\r\n\r\n');
    const name = head.match(/name="([^"]+)"/)[1];

    if (head.includes('filename="')) {
      // 文件
      const filename = head.match(/filename="([^"]+)"/)[1];
      const data = Buffer.from(body.join('\r\n\r\n'), 'binary');
      files[name] = { filename, data };
    } else {
      // 普通字段
      const value = Buffer.from(body.join('\r\n\r\n'), 'binary').toString();
      fields[name] = value;
    }
  }

  return { fields, files };
}

module.exports = CoDrive;