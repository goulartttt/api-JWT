var CryptoJS = require("crypto-js");
const config = require('./config.js');

const utils = {
    crypt:(senha) => {
        return CryptoJS.AES.encrypt(senha, config.crypto).toString();
    },
    decrypt: (hash) => {
        const bytes  = CryptoJS.AES.decrypt(hash, config.crypto);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}

module.exports = utils