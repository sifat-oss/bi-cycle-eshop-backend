export type TErrorSource = {
    path: string | number;
    details: string | null;
}[]

export type TGenericErrorResponse  = {
    statusCode: number;
    message: string;
    error: TErrorSource;
}