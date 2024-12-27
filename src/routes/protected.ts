import express, {NextFunction, request, Request, Response} from "express";
import {authenticateToken, CustomRequest} from "../middleware/auth";

import Post, {IPost} from "../models/Posts";
import User from "../models/Users";

const router = express.Router()

router.post('/post', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, content, author, keywords} = req.body
        const newPost: IPost = new Post({title, content, author, keywords})
        const saved = await newPost.save();
        res.status(200).json({...saved, message: 'Post successfully created'})
    } catch (err) {
        console.log(err, 'catch err')
        next(err)
    }
})
router.get('/posts', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {page , limit } = req.query
        const pageNum =  parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const posts = await Post.find().sort({createdAt: -1}).limit(limitNum).skip((limitNum) * (pageNum - 1)).populate('author', 'username')
        const total_posts = await Post.countDocuments()
        res.status(200).json({
            total_posts,
            total_pages: Math.ceil(total_posts / limitNum),
            current_page: pageNum,
            posts,
        })
    } catch (err) {
        res.status(500).json('internal server error')
        next(err)
    }

})
router.put('/posts/:id', authenticateToken , (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        console.log(id, req.user?.id)

    }
    catch(err){
    }

})
router.get('/users', authenticateToken,async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        const userId = req.user?.id
        const userInfo = await User.findById(userId).select('-password -__v')
        console.log(userInfo)
        res.status(200).json({
            userInfo
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    }
})
export default router;
