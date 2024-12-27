import jwt from 'jsonwebtoken'
import * as process from "node:process";
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';
export const generateToken = (userId: string) => {
    return jwt.sign({id: userId}, SECRET_KEY, {expiresIn: '1h'})
}
