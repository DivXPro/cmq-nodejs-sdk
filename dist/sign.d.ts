export declare class Signature {
    static makeSignPlainText(params: {
        [key: string]: any;
    }, method: string | undefined, host: string, path: string): string;
    static sign(text: any, secretKey: string, signMethod?: string): string;
    private static makeParamStr;
}
