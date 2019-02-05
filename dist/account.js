"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmqClient_1 = require("./cmqClient");
const queue_1 = require("./queue");
class Account {
    constructor(host, region, secretId, secretKey) {
        this.host = host;
        this.region = region;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.cmqClient = new cmqClient_1.CMQClient(this.host, this.region, secretId, secretKey);
    }
    setSignMethod(signMethod) {
        this.cmqClient.setSignatureMethod(signMethod);
    }
    setClient(host, region, secretId, secretKey) {
        this.cmqClient = new cmqClient_1.CMQClient(host, region, secretId || this.secretId, secretKey || this.secretKey);
    }
    getClient() {
        return this.cmqClient;
    }
    getQueue(queueName) {
        return new queue_1.Queue(queueName, this.cmqClient);
    }
    listQueue() { }
    listTopic() { }
    getTopic() { }
    getSubscription() { }
}
exports.Account = Account;
//# sourceMappingURL=account.js.map