import express, {NextFunction, request, Request, Response} from "express";
import {authenticateToken, CustomRequest} from "../middleware/auth";
import path from "path";

import Post, {IPost} from "../models/Posts";
import User from "../models/Users";
import {ApiResponse} from "../utils/ApiResponse";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const sendResponse = (res: Response, status: number, response: ApiResponse) => {
    res.status(status).json(response);
};

const router = express.Router()

router.get('/users', authenticateToken, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id
        const userInfo = await User.findById(userId).select('-password -__v')
        sendResponse(res, 200, {
            success: {
                title: 'Fetched',
                message:'User info successfully fetched!'
            },
            data: {user: userInfo},
        })
    } catch (err) {
        sendResponse(res, 500, {
            error: {code: "ERR", title: 'Server Error', message: "Internal server error"},
        })
        next(err)
    }
})

router.put('/users', authenticateToken, async (req: CustomRequest, res: Response, next: NextFunction) => {

    try {
        const userId = req.user?.id;
        const body = req.body
        const existingUser = await User.findOne({
            $or: [
                { email: body.email },
                { username: body.username },
                { phone_number: body.phone_number }
            ]
        });

        if (existingUser) {
            let errorMessage = "";
            console.log('user existed:', existingUser)
            if (existingUser.email === body.email) {
                errorMessage = "Email already in use";
            } else if (existingUser.username === body.username) {
                errorMessage = "Username already in use";
            } else if (existingUser.phone_number === body.phone_number) {
                errorMessage = "Phone number already in use";
            }

            return sendResponse(res, 400, {
                error: { code: "ERR", title: "Bad Request", message: errorMessage }
            });
        }
        const updated = await Post.findByIdAndUpdate({_id: userId}, body, {new: true})
        if (updated) {
            sendResponse(res, 200, {
                success: {
                    title: 'Updated',
                    message: "User successfully updated!",
                },
                data: {post: updated},

            })
            return
        } else {
            sendResponse(res, 404, {
                error: {code: "ERR", title: 'Not Found', message: "Post not found!"},
            })
            return
        }

    } catch (err) {
        sendResponse(res, 500, {
            error: {code: "ERR", title: 'Server Error', message: "Internal server error!"},
        })
        next(err)
    }
})
router.post('/posts', authenticateToken, async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    try {
        const {title, content, author, keywords} = req.body
        const newPost: IPost = new Post({title, content, author: userId, keywords})
        const saved = await newPost.save();
        sendResponse(res, 200, {
            success: {
                title: 'Created',
                message:'Post successfully created!'
            },
            data: {post: {...saved, }},
        })
    } catch (err) {
        sendResponse(res, 500, {
            error: {code: "ERR", title: 'Server Error', message: "Internal server error"},
        })
        next(err)
    }
})
router.get('/users/posts/:id', authenticateToken, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params?.id === '1' ? req.user?.id : req.params?.id

        const {page, limit} = req.query
        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const posts = await Post.find({author: new mongoose.Types.ObjectId(id) }).sort({createdAt: -1}).limit(limitNum).skip((limitNum) * (pageNum - 1)).populate('author', 'username profile_image_url')
        const total_posts = await Post.find({author: new mongoose.Types.ObjectId(id) }).countDocuments()
        sendResponse(res, 200, {
            data: {posts},
            success:{
                title: 'Fetched',
                message: "User's posts successfully fetched",
            },
            meta: {
                total_posts,
                total_pages: Math.ceil(total_posts / limitNum),
                current_page: pageNum,
            },
        })
    } catch (err) {
        sendResponse(res, 500, {
            error: {code: "ERR", title: 'Server Error', message: "Internal server error"},
        })
        next(err)
    }
})

router.put('/posts/:id', authenticateToken, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const {id} = req.params
        const body = req.body
        if (!id) {
            sendResponse(res, 400, {
                error: {code: "ERR", title: 'Bad Request', message: "To update a post, Id is required!"},
            })
        }
        let postAuthor = null
        await Post.findById(id).then((post) => {
            postAuthor = post?.author?.toString()
        })
        if (userId !== postAuthor) {
            sendResponse(res, 403, {
                error: {code: "ERR", title: 'Access Denied', message: "You doesnt have access to update this post!"},
            })
            return
        }
        const updated = await Post.findByIdAndUpdate({_id: id}, body, {new: true})
        if (updated) {
            sendResponse(res, 200, {
                success: {
                    title: 'Updated',
                    message: "Post successfully updated!",
                },
                data: {post: updated},

            })
            return
        } else {
            sendResponse(res, 404, {
                error: {code: "ERR", title: 'Not Found', message: "Post not found!"},
            })
            return
        }

    } catch (err) {
        sendResponse(res, 500, {
            error: {code: "ERR", title: 'Server Error', message: "Internal server error!"},
        })
        next(err)
    }
})

router.get('/posts/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        if (!id)
            sendResponse(res, 400, {
                error: {code: "ERR", title: 'Bad Request', message: "To get a post, Id is required!"},
            })
        const post = await Post.findById(id)
        if (!post)
            sendResponse(res, 404, {
                error: {code: "ERR", title: 'Not Found', message: "Post not found!"},
            })
        else
            sendResponse(res, 200, {
                success: {
                    title: 'Fetched',
                    message: "Selected post successfully fetched!",
                },
                data: {post},
            })
    } catch (err) {
        sendResponse(res, 500, {
            error: {code: "ERR", title: 'Server Error', message: "Internal server error!"},
        })
        next(err)
    }
})

router.get('/posts', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {page, limit} = req.query
        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const posts = await Post.find().sort({createdAt: -1}).limit(limitNum).skip((limitNum) * (pageNum - 1)).populate('author', 'username profile_image_url')
        const total_posts = await Post.countDocuments()

        sendResponse(res, 200, {
            success: {
                title: "Fetched",
                message: "Posts index successfully updated",
            },
            data: {posts},
            meta: {
                total_posts,
                total_pages: Math.ceil(total_posts / limitNum),
                current_page: pageNum,
            },
        })
    } catch (err) {
        sendResponse(res, 500, {
            error: {code: "ERR", title: 'Server Error', message: "Internal server error"},
        })
        next(err)
    }

})

router.delete('/posts/:id', authenticateToken, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const {id} = req.params
        if (!id) {
            sendResponse(res, 400, {
                error: {code: "ERR", title: 'Bad Request', message: "To delete a post, Id is required!"},
            })
            return
        }
        let postAuthor
        await Post.findById(id).then((post) => {
            postAuthor = post?.author?.toString()
        })
        if (userId !== postAuthor) {
            sendResponse(res, 403, {
                error: {code: "ERR", title: 'Access Denied', message: "You doesnt have access to delete this post!"},
            })
            return
        }
        await Post.findByIdAndDelete(id)
        sendResponse(res, 200, {
            success: {title: 'Deleted', message: "Post deleted successfully"},
            data: {id},
        })

    } catch (err) {
        next(err)
    }
})

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.use("/uploads", express.static(path.join(__dirname, "uploads")));
export default router;
