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
                return res.send(r.file);
            })
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
            error: json.error
        };
        const url = json.data.urls[0].url;
        const r = await fetch(url);
        const blob = await r.blob();
        return {
            file: blob
        };
    }
}

module.exports = CoDrive;