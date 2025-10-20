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
            const token = json.data.token.refresh_token;
            const expires = json.data.token.refresh_expires;
            this.token = token;
            this.expires = Date.parse(expires);
        }, 30000);
    }
    async fetchData(path, method, _raw) {
        console.log(this.token);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authentication", `Bearer ${this.token}`)
        const raw = _raw;
        const requestOptions = {
            method: method,
            headers: headers,
            body: method == 'GET' ? void 0 : raw,
            redirect: 'follow'
        };
        const r = await fetch(`${this.baseUrl}${path}`, requestOptions);
        const j = await r.json();
        console.log('CoDrive', j);
        return j;
    }
    start(app) {
        app.get("/api/cloud/filelist", async (req,res) => {
            const {uri,page,pagesize}=req.query;
            const json = await this.fetchData(`/file?uri=${`cloudreve://my${decodeURIComponent(uri)}`}&page=${page}&page_size=${pagesize}`, "GET");
            return res.json(json);
        });
    }
}

module.exports = CoDrive;