class CoDrive {
    baseUrl = 'https://drive.amethyst.ltd/api/v4';
    
    fetchData(_raw) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authentication"， `Bearer ${this.token}`)
        const raw = _raw;
    }
}

module.exports = CoDrive;