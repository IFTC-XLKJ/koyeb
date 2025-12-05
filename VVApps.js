const crypto = require("crypto");
const Sign = require("./Sign.js");
const sign = new Sign();

const VVAppsAppkey = "LkduYVIN+ZUWzF7FSj+NsNqrGBGJmkFdk08tX2/Rm0dbeqAqR82HeOjnd+soDEpbSbW06EwVYT38wb0nNOx5lxTmPkmVBOErbF5mNqsyQOgX1YRTD4bRxkEhaZ0+evEwQSqYnA7z5aHmCrd0o8F4OZU8p3gJla+jo15DuJZVFC0=";
const getDataURL = "https://api.pgaot.com/dbs/cloud/get_table_data";
const setDataURL = "https://api.pgaot.com/dbs/cloud/set_table_data";
const contentType = "application/json";

module.exports = class {};