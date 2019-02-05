import AxiosStatic, { AxiosInstance } from 'axios';
import { Signature } from './sign';
import { QueueMeta } from './queue';

const PATH = 'v2/index.php';
const SEND_MESSAGE = 'SendMessage';
const RECEIVE_MESSAGE = 'ReceiveMessage';
const DELETE_MESSAGE = 'DeleteMessage';
const CREATE_QUEUE = 'CreateQueue';

export class CMQClient {
  private host: string;
  private secretId: string;
  private secretKey: string;
  private version: string;
  private http: AxiosInstance;
  private method: string = 'POST';
  private SignatureMethod: string = 'HmacSHA1';

  constructor(
    host: string,
    secretId: string,
    secretKey: string,
    version = 'CMQ_NODEJS_SDK_1.3',
    method = 'POST'
  ) {
    this.host = host;
    this.secretId = secretId;
    this.secretKey = secretKey;
    this.version = version;
    this.method = method;
    this.http = AxiosStatic.create({
      baseURL: host,
      headers:
        method === 'POST'
          ? {
              'content-type': 'application/x-www-form-urlencoded'
            }
          : {}
    });
  }

  public setSignatureMethod(SignatureMethod: string) {
    if (SignatureMethod === 'sha1' || SignatureMethod === 'HmacSHA256') {
      this.SignatureMethod = 'HmacSHA1';
    } else if (SignatureMethod == 'sha256') {
      this.SignatureMethod = 'HmacSHA256';
    } else {
      throw new Error(
        `Only support Signature method HmasSHA256 or HmacSHA1 . Invalid Signature method: ${SignatureMethod}`
      );
    }
  }

  protected async request(action: string, params: any) {
    params = this.buildParams(action, params, 'POST', this.host, PATH);

    const resp = await this.http.post(PATH, params);
    if (resp.status !== 200) {
      throw new Error(`request ${params} fail: ${resp.status}`);
    }
    const { code, message, requestId } = resp.data;
    if (code !== 0) {
      throw new Error(`request ${requestId} error code: ${code}, message: ${message}`);
    }
    return resp;
  }

  private buildParams(action: string, params: any, method = 'POST', host: string, path: string) {
    params['Action'] = action;
    params['RequestClient'] = this.version;
    params['SecretId'] = this.secretId;
    params['Nonce'] = Math.random();
    params['Timestamp'] = new Date().getTime();
    params['SignatureMethod'] = this.SignatureMethod;
    // 添加签名
    const plainText = Signature.makeSignPlainText(params, method, host, path);
    params['Signature'] = Signature.sign(plainText, this.secretKey, this.SignatureMethod);
    return params;
  }

  // ----------- queue operation --------------
  public createQueue(params: QueueMeta & { queueName: string }) {
    return this.request(CREATE_QUEUE, params);
  }

  public async sendMessage(params: any) {
    const resp = await this.request(SEND_MESSAGE, params);
    return resp.data;
  }

  public async receiveMessage(params: any) {
    const resp = await this.request(RECEIVE_MESSAGE, params);
    return resp.data;
  }

  public async deleteMessage(params) {
    const resp = await this.request(DELETE_MESSAGE, params);
    return resp.data;
  }
}
