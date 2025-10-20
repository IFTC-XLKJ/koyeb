class CoDrive {
    baseUrl = 'https://drive.amethyst.ltd/api/v4';
    token = '';
    email = 'iftcceo@139.com';
    pwd = 'stree123456';
    expires = 0;
    constructor() {
        setInterval(async () => {
            const json = await this.fetchData('/session/token', 'POST', JSON.stringify({
                email: this.email,
                password: this.pwd,
            }));
        }, 30000);
    }
    async fetchData(path, method, _raw) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authentication", `Bearer ${this.token}`)
        const raw = _raw;
        const requestOptions = {
            method: method,
            headers: headers,
            body: raw,
            redirect: 'follow'
        };
        const r = await fetch(`${this.baseUrl}${path}`, requestOptions);
        const j = await r.json();
        console.log('CoDrive', j);
        return j;
    }
    start() {}
}

module.exports = CoDrive;