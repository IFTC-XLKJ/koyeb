const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const NOOBKey = "LkduYVIN+ZUTA2pX6P23IcX+TZ/pbiiMk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOjtpix5Xz10DuRd2uyWwJKst8iKDzWqQWSRSQcB1kDw0lDy+GZKmxv0o15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class NOOB {
    constructor() { }
}

module.exports = NOOB;