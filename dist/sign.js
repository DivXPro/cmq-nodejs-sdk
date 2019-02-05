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
        let signer;
        switch (signMethod) {
            case 'HmacSHA1':
                signer = crypto.createHmac('sha1', secretKey);
                break;
            case 'HmacSHA256':
                signer = crypto.createHmac('SHA256', secretKey);
                break;
            default:
                throw new Error(`${signMethod} is not a supported encrypt method`);
        }
        signer.update(text);
        return signer.digest('base64');
    }
    static makeParamStr(params, method = 'POST') {
        let paramStr = '';
        let idx = 0;
        let paramsKeys = [];
        for (let key in params) {
            if (key === 'Signature') {
                continue;
            }
            if (method == 'POST' && typeof params[key] === 'string' && params[key].substr(0, 1) === '@') {
                continue;
            }
            paramsKeys.push(key);
        }
        paramsKeys = paramsKeys.sort();
        for (let key in paramsKeys) {
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
            paramStr = `${paramStr}${key}=${params[key]}`;
            idx += 1;
        }
        return paramStr;
    }
}
exports.Signature = Signature;
//# sourceMappingURL=sign.js.map