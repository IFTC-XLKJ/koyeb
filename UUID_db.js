const fetch = require("node-fetch");
const Sign = require("./Sign.js");
const sign = new Sign();

const UUID_dbKEY = "LkduYVIN+ZVpT2OpSV2DM5gdurynzN8Mk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOgX1YRTD4bRxjkxKTd/6hMWRN0NetHfBJoKankFcCLU0Vf9bHQwR/X8o15DuJZVFC0="
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

class UUID_db {
    constructor() { }
}
module.exports = UUID_db;