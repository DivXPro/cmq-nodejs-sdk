import { CMQClient } from './cmqClient';
import { Queue } from './queue';
export class Account {
  private host: string;
  private region: string;
  private secretId: string;
  private secretKey: string;
  private cmqClient: CMQClient;

  constructor(host: string, region: string, secretId: string, secretKey: string) {
    this.host = host;
    this.region = region;
    this.secretId = secretId;
    this.secretKey = secretKey;
    this.cmqClient = new CMQClient(this.host, this.region, secretId, secretKey);
  }

  /**
   * @param signMethod: only support sha1 and sha256
   */
  public setSignMethod(signMethod: string) {
    this.cmqClient.setSignatureMethod(signMethod);
  }

  public setClient(host: string, region: string, secretId?: string, secretKey?: string) {
    this.cmqClient = new CMQClient(host, region, secretId || this.secretId, secretKey || this.secretKey);
  }

  public getClient() {
    return this.cmqClient;
  }

  public getQueue(queueName: string) {
    return new Queue(queueName, this.cmqClient);
  }

  public listQueue() {}

  public listTopic() {}

  public getTopic() {}

  public getSubscription() {}
}
