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
class Queue {
    constructor(queueName, cmqClient, encoding = false) {
        this.queueName = queueName;
        this.cmqClient = cmqClient;
        this.encoding = encoding;
    }
    setEncoding(encodeing = false) {
        this.encoding = encodeing;
    }
    create(queueMeta) {
        const params = {
            queueName: this.queueName,
            pollingWaitSeconds: queueMeta.pollingWaitSeconds,
            visibilityTimeout: queueMeta.visibilityTimeout,
            maxMsgSize: queueMeta.maxMsgSize,
            msgRetentionSeconds: queueMeta.msgRetentionSeconds,
            rewindSeconds: queueMeta.rewindSeconds
        };
        if (queueMeta.maxMsgHeapNum != null && queueMeta.maxMsgHeapNum > 0) {
            params['maxMsgHeapNum'] = queueMeta.maxMsgHeapNum;
        }
        this.cmqClient.createQueue(params);
    }
    sendMessage(msg, delaySeconds = 0) {
        const msgBody = this.encoding ? new Buffer(JSON.stringify(msg)).toString('base64') : msg;
        const params = {
            queueName: this.queueName,
            msgBody,
            delaySeconds
        };
        return this.cmqClient.sendMessage(params);
    }
    batchSendMessage(msgs, delaySeconds = 0) {
        const params = {
            queueName: this.queueName,
            delaySeconds,
        };
        let idx = 1;
        for (const msg of msgs) {
            const key = `msgBody.${idx}`;
            params[key] = this.encoding ? new Buffer(JSON.stringify(msg)).toString('base64') : msg;
            idx += 1;
        }
        return this.cmqClient.batchSendMessage(params);
    }
    receiveMessage(pollingWaitSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                queueName: this.queueName
            };
            if (pollingWaitSeconds != null) {
                params['pollingWaitSeconds'] = pollingWaitSeconds;
            }
            else {
                params['pollingWaitSeconds'] = 30;
            }
            const receiveMsg = yield this.cmqClient.receiveMessage(params);
            if (this.encoding) {
                receiveMsg.msgBody = new Buffer(receiveMsg.msgBody, 'base64').toString();
            }
            return receiveMsg;
        });
    }
    deleteMessage(receiptHandle) {
        const params = { queueName: this.queueName, receiptHandle };
        return this.cmqClient.deleteMessage(params);
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map