import express, {Request, RequestHandler, Response} from "express";
import {generateToken} from "../utils/jwt";
import User, {IUser} from '../models/Users'
import bcrypt from 'bcrypt'
import {ApiResponse} from "@/utils/ApiResponse";
const router  = express.Router()
const sendResponse = (res: Response, status: number, response: ApiResponse) => {
    res.status(status).json(response);
};
router.post('/register',  (async (req: Request, res: Response) => {
    const {username, email, password, phone_number, first_name, last_name, profile_image_url} = req.body
    try{
        const existingUser = await User.findOne({
            $or: [
                { email },
                { username },
                { phone_number }
            ]
        });

        if (existingUser) {
            let errorMessage = "";
            console.log('user existed:', existingUser)
            if (existingUser.email === email) {
                errorMessage = "Email already in use";
            } else if (existingUser.username === username) {
                errorMessage = "Username already in use";
            } else if (existingUser.phone_number === phone_number) {
                errorMessage = "Phone number already in use";
            }

            return sendResponse(res, 400, {
                error: { code: "ERR", title: "Bad Request", message: errorMessage }
            });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)
        const newUser: IUser = new User({username, email, password: hashedPass, phone_number, first_name, last_name, profile_image_url})
        const response = await newUser.save()
        const token = generateToken(response._id as string)
        sendResponse(res, 200, {
            success: {
                title: 'Hoora!',
                message:'User registered successfully!'
            },
            data: {token: token, user_id: response._id, user: response},

        })
        return
    }
    catch(err){
        sendResponse(res, 500, {
            error: { code: "ERR", title: 'Server Error', message: "Internal server error" },
        });
    }
}) as RequestHandler)

router.post('/login', (async (req:Request, res:Response) => {
    const {credential, password} = req.body

    try{
        const user = await User.findOne({username: credential}) || await User.findOne({email: credential}) || await User.findOne({phone_number: credential})
        if (!user){
            return sendResponse(res, 401, {
                error: {code: "ERR", title: 'Unauthorized', message: "invalid credentials"}
            })
        }

        const isMatch  = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return sendResponse(res, 401, {
                error: {code: "ERR", title: 'Unauthorized', message: "invalid password"}
            })
        }
        const token = generateToken(user._id as string)
        const userInfo = await User.findById(user._id).select('-password -__v')

        sendResponse(res, 200, {
            success: {
                title: 'Hoora!',
                message:'User Are successfully logged in!'
            },
            data: {token: token, user_id: user._id, user: userInfo},
        })
    }
    catch(err){
        sendResponse(res, 500, {
            error: { code: "ERR", title: 'Server Error', message: "Internal server error" },
        });
    }
}) as RequestHandler)
export default router
