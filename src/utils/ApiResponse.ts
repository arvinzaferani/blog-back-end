import { Response } from "express";
export type ApiMessage = {
    code?: string
    title: string;
    message: string;
}
export type ApiResponse = {
    success?: ApiMessage;
    data?: any;
    error?: ApiMessage
    meta?: any;
};

export const sendResponse = (res: Response, status: number, response: ApiResponse) => {
    res.status(status).json(response);
};
