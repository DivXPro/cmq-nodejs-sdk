"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const sign_1 = require("./sign");
const PATH = '/v2/index.php';
const SEND_MESSAGE = 'SendMessage';
const RECEIVE_MESSAGE = 'ReceiveMessage';
const DELETE_MESSAGE = 'DeleteMessage';
const CREATE_QUEUE = 'CreateQueue';
class CMQClient {
    constructor(host, secretId, secretKey, version = 'CMQ_NODEJS_SDK_1.3', method = 'POST') {
        this.method = 'POST';
        this.SignatureMethod = 'HmacSHA1';
        this.host = host;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.version = version;
        this.method = method;
        this.http = axios_1.default.create({
            baseURL: host,
            headers: method === 'POST'
                ? {
                    'content-type': 'application/x-www-form-urlencoded'
                }
                : {}
        });
    }
    setSignatureMethod(SignatureMethod) {
        if (SignatureMethod === 'sha1' || SignatureMethod === 'HmacSHA256') {
            this.SignatureMethod = 'HmacSHA1';
        }
        else if (SignatureMethod == 'sha256') {
            this.SignatureMethod = 'HmacSHA256';
        }
        else {
            throw new Error(`Only support Signature method HmasSHA256 or HmacSHA1 . Invalid Signature method: ${SignatureMethod}`);
        }
    }
    request(action, params) {
        return __awaiter(this, void 0, void 0, function* () {
            params = this.buildParams(action, params, 'POST', this.host, PATH);
            const resp = yield this.http.post(PATH, params);
            if (resp.status !== 200) {
                throw new Error(`request ${params} fail: ${resp.status}`);
            }
            const { code, message, requestId } = resp.data;
            if (code !== 0) {
                throw new Error(`request ${requestId} error code: ${code}, message: ${message}`);
            }
            return resp;
        });
    }
    buildParams(action, params, method = 'POST', host, path) {
        params['Action'] = action;
        params['RequestClient'] = this.version;
        params['SecretId'] = this.secretId;
        params['Nonce'] = Math.random();
        params['Timestamp'] = new Date().getTime();
        params['SignatureMethod'] = this.SignatureMethod;
        const plainText = sign_1.Signature.makeSignPlainText(params, method, host, path);
        params['Signature'] = sign_1.Signature.sign(plainText, this.secretKey, this.SignatureMethod);
        return params;
    }
    createQueue(params) {
        return this.request(CREATE_QUEUE, params);
    }
    sendMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.request(SEND_MESSAGE, params);
            return resp.data;
        });
    }
    receiveMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.request(RECEIVE_MESSAGE, params);
            return resp.data;
        });
    }
    deleteMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.request(DELETE_MESSAGE, params);
            return resp.data;
        });
    }
}
exports.CMQClient = CMQClient;
//# sourceMappingURL=cmqClient.js.map