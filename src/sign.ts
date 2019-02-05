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
    return `${method}${url.replace(/^https:\/\//i, '')}${paramStr}`;
  }

  public static sign(text: string, secretKey: string, signMethod = 'HmacSHA1') {
    let signer: crypto.Hmac;
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

  private static makeParamStr(params: { [key: string]: string }, method = 'POST') {
    let paramStr = '';
    let idx = 0;
    let paramsKeys: string[] = [];
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
    for (let key of paramsKeys) {
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
      paramStr = `${paramStr}${key}=${params[key]}`;
      idx += 1;
    }
    return paramStr;
  }
}
