import * as crypto from 'crypto';

export class Signature {
  public static makeSignPlainText(
    params: { [key: string]: any },
    method = 'POST',
    host: string,
    path: string
  ) {
    const url = `${host}${path}`;
    const paramStr = this.makeParamStr(params);
    return `${method}${url}${paramStr}`;
  }

  public static sign(text, secretKey: string, signMethod = 'HmacSHA1') {
    let signature;
    let signer: crypto.Signer;
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

  private static makeParamStr(params: { [key: string]: string }, method = 'POST') {
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
      } else {
        paramStr = `${paramStr}&`;
      }
      paramStr = `${paramStr}=${params[key]}`;
      idx += 1;
    }
    return paramStr;
  }
}
