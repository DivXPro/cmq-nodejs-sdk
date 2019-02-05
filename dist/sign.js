"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class Signature {
    static makeSignPlainText(params, method = 'POST', host, path) {
        const url = `${host}${path}`;
        const paramStr = this.makeParamStr(params);
        return `${method}${url}${paramStr}`;
    }
    static sign(text, secretKey, signMethod = 'HmacSHA1') {
        let signature;
        let signer;
        switch (signMethod) {
            case 'HmacSHA1':
                signer = crypto.createSign('SHA1');
                signer.update(text);
                signature = new Buffer(signer.sign(secretKey)).toString('base64');
                break;
            case 'HmacSHA256':
                signer = crypto.createSign('SHA256');
                signer.update(text);
                signature = new Buffer(signer.sign(secretKey)).toString('base64');
                break;
            default:
                throw new Error(`${signMethod} is not a supported encrypt method`);
        }
        return signature;
    }
    static makeParamStr(params, method = 'POST') {
        let paramStr = '';
        let idx = 0;
        for (let key in params) {
            if (key === 'Signature') {
                continue;
            }
            if (method == 'POST' && typeof params[key] === 'string' && params[key].substr(0, 1) === '@') {
                continue;
            }
            if (/_/.test(key)) {
                key = key.replace(/_/g, '.');
            }
            if (idx === 0) {
                paramStr = `${paramStr}?`;
            }
            else {
                paramStr = `${paramStr}&`;
            }
            paramStr = `${paramStr}=${params[key]}`;
            idx += 1;
        }
        return paramStr;
    }
}
exports.Signature = Signature;
//# sourceMappingURL=sign.js.map