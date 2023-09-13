var CryptoJS = require("crypto-js");
const config = require('./config.js');

const utils = {
    crypt:(senha) => {
        return CryptoJS.AES.encrypt(senha, config.crypto).toString();
    },
    decrypt: (hash) => {
        const bytes  = CryptoJS.AES.decrypt(hash, config.crypto);
        return bytes.toString(CryptoJS.enc.Utf8);
    },
     gerarCodigoUnico:(length) => {
        return `USER${Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 8).toUpperCase()}`
    }
}

module.exports = utils