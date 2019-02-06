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
export declare class Queue {
    private queueName;
    private cmqClient;
    private encoding;
    constructor(queueName: string, cmqClient: CMQClient, encoding?: boolean);
    setEncoding(encodeing?: boolean): void;
    create(queueMeta: QueueMeta): void;
    sendMessage(msg: any, delaySeconds?: number): Promise<any>;
    batchSendMessage(msgs: any[], delaySeconds?: number): Promise<any>;
    receiveMessage(pollingWaitSeconds?: number): Promise<ReveiveMessage>;
    deleteMessage(receiptHandle: string): Promise<any>;
}
