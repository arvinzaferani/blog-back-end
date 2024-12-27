import express, {Request, RequestHandler, Response} from "express";
import {generateToken} from "../utils/jwt";
import User, {IUser} from '../models/Users'
import bcrypt from 'bcrypt'
const router  = express.Router()

interface RegisterRequestBody {
    username: string;
    password: string;
    email: string;
}

router.post('/register',  (async (req: Request, res: Response) => {
    const {username, email, password} = req.body
    try{
        const existingUser = await User.findOne({email})
        if (existingUser){
            return res.status(400).json({message: 'Email already in use'})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)
        const newUser: IUser = new User({username, email, password: hashedPass})
        await newUser.save()
        res.status(201).json({message: 'Hoora! User registered successfully!'})
    }
    catch(err){
        res.status(500).json({message: 'Internal server error', error: err})
    }
}) as RequestHandler)

router.post('/login', (async (req:Request, res:Response) => {
    const {username, password, email} = req.body
    console.log(username, password, email)

    try{
        const user = await User.findOne({email})
        if(!user){
            console.log('invalid credentials')
            return res.status(401).json({message: 'invalid credentials'})
        }

        const isMatch  = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(401).json({message: 'invalid password'})
        }
        const token = generateToken(user._id as string)
        res.status(200).json({token: token, user_id: user._id})
    }
    catch(err){
        res.status(500).json('internal server error')
    }
}) as RequestHandler)
export default router
