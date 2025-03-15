const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const AppUpdateCheckKey = "LkduYVIN+ZW/V/puUuQEBEqhh3LVki4Qk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOhBTieBGXcSepwb0ynurC2w53Fc18bCkKKvUrN8cRqwvPNMvOUZWyu4o15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class AppUpdateCheck {
    constructor() { }
    async check(packageName, versionCode) {
    }
}

module.exports = AppUpdateCheck;