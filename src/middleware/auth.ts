import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import * as process from "node:process";

export interface CustomRequest extends Request {
    user?: JwtPayload;
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key'  ;

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.status(401).json({message: 'Token missing or invalid'});
        return
    }
    try{
       const user = jwt.verify(token, SECRET_KEY ) as { id: string, name: string}
        req.user = user ;
        next();
    }
    catch(err: any){
        if (err?.name === 'TokenExpiredError') {
            res.status(401).json({message: 'Token Expired'})
            return
        }
        if (err) {
            res.status(403).json({message: 'Invalid token'});
            return

        }
    }
};
