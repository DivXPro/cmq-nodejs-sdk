import { QueueMeta } from './queue';
export declare class CMQClient {
    private host;
    private secretId;
    private secretKey;
    private version;
    private http;
    private method;
    private SignatureMethod;
    constructor(host: string, secretId: string, secretKey: string, version?: string, method?: string);
    setSignatureMethod(SignatureMethod: string): void;
    protected request(action: string, params: any): Promise<import("axios").AxiosResponse<any>>;
    private buildParams;
    createQueue(params: QueueMeta & {
        queueName: string;
    }): Promise<import("axios").AxiosResponse<any>>;
    sendMessage(params: any): Promise<any>;
    receiveMessage(params: any): Promise<any>;
    deleteMessage(params: any): Promise<any>;
}
