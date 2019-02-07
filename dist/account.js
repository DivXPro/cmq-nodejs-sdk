"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmqClient_1 = require("./cmqClient");
const queue_1 = require("./queue");
class Account {
    constructor(host, secretId, secretKey) {
        this.host = host;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.cmqClient = new cmqClient_1.CMQClient(this.host, secretId, secretKey);
    }
    setSignMethod(signMethod) {
        this.cmqClient.setSignatureMethod(signMethod);
    }
    setClient(host, secretId, secretKey) {
        this.cmqClient = new cmqClient_1.CMQClient(host, secretId || this.secretId, secretKey || this.secretKey);
    }
    getClient() {
        return this.cmqClient;
    }
    getQueue(queueName, encoding = false) {
        return new queue_1.Queue(queueName, this.cmqClient, encoding);
    }
    listQueue() { }
    listTopic() { }
    getTopic() { }
    getSubscription() { }
}
exports.Account = Account;
//# sourceMappingURL=account.js.map