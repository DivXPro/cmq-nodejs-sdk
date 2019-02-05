import { CMQClient } from './cmqClient';
import { Queue } from './queue';
export declare class Account {
    private host;
    private region;
    private secretId;
    private secretKey;
    private cmqClient;
    constructor(host: string, region: string, secretId: string, secretKey: string);
    setSignMethod(signMethod: string): void;
    setClient(host: string, region: string, secretId?: string, secretKey?: string): void;
    getClient(): CMQClient;
    getQueue(queueName: string): Queue;
    listQueue(): void;
    listTopic(): void;
    getTopic(): void;
    getSubscription(): void;
}
