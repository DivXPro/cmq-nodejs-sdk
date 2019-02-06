import { CMQClient } from './cmqClient';

export interface QueueMeta {
  pollingWaitSeconds?: number;
  visibilityTimeout?: number;
  maxMsgSize?: number;
  msgRetentionSeconds?: number;
  rewindSeconds?: number;
  maxMsgHeapNum?: number;
}

export interface QueueMessage {
  queueName: string;
  msgBody?: any;
  delaySeconds: number;
}

export interface ReveiveMessage {
  code: number;
  message: string;
  requestId: string;
  msgBody: any;
  msgId: string;
  receiptHandle: string;
  enqueueTime: number;
  firstDequeueTime: number;
  nextVisibleTime: number;
  dequeueCount: number;
}

export class Queue {
  private queueName: string;
  private cmqClient: CMQClient;
  private encoding: boolean;

  constructor(queueName: string, cmqClient: CMQClient, encoding = false) {
    this.queueName = queueName;
    this.cmqClient = cmqClient;
    this.encoding = encoding;
  }

  public setEncoding(encodeing = false) {
    this.encoding = encodeing;
  }

  public create(queueMeta: QueueMeta) {
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

  public sendMessage(msg: any, delaySeconds = 0) {
    const msgBody = this.encoding ? new Buffer(JSON.stringify(msg)).toString('base64') : msg;
    const params: QueueMessage = {
      queueName: this.queueName,
      msgBody,
      delaySeconds
    };
    return this.cmqClient.sendMessage(params);
  }

  public batchSendMessage(msgs: any[], delaySeconds = 0) {
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

  public async receiveMessage(pollingWaitSeconds?: number) {
    const params = {
      queueName: this.queueName
    };
    if (pollingWaitSeconds != null) {
      params['pollingWaitSeconds'] = pollingWaitSeconds;
    } else {
      params['pollingWaitSeconds'] = 30;
    }
    const receiveMsg: ReveiveMessage = await this.cmqClient.receiveMessage(params);
    if (this.encoding) {
      receiveMsg.msgBody = new Buffer(receiveMsg.msgBody, 'base64').toString();
    }
    return receiveMsg;
  }

  public deleteMessage(receiptHandle: string) {
    const params = { queueName: this.queueName, receiptHandle };
    return this.cmqClient.deleteMessage(params);
  }
}
