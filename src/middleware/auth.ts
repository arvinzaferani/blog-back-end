import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import * as process from "node:process";
import {ApiResponse} from "../utils/ApiResponse";
const sendResponse = (res: Response, status: number, response: ApiResponse) => {
    res.status(status).json(response);
};
export interface CustomRequest extends Request {
    user?: JwtPayload;
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key'  ;

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        sendResponse(res, 401, {
            error: { code: "ERR", title: 'Unauthorized', message: "Internal server error" },
        })
        return
    }
    try{
       const user = jwt.verify(token, SECRET_KEY ) as { id: string, name: string}
        req.user = user ;
        next();
    }
    catch(err: any){
        if (err?.name === 'TokenExpiredError') {
            sendResponse(res, 401, {
                error: { code: "ERR", title: 'Unauthorized', message: "Token Expired" },
            })
            return
        }
        if (err) {
            res.status(403).json({message: 'Invalid token'});
            sendResponse(res, 403, {
                error: { code: "ERR", title: 'Access Denied', message: "Invalid token" },
            })
            return

        }
    }
};
