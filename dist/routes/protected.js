"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Posts_1 = __importDefault(require("../models/Posts"));
const router = express_1.default.Router();
router.post('/post', auth_1.authenticateToken, async (req, res, next) => {
    try {
        const { title, content, author, keywords } = req.body;
        const newPost = new Posts_1.default({ title, content, author, keywords });
        const saved = await newPost.save();
        res.status(200).json({ ...saved, message: 'Post successfully created' });
    }
    catch (err) {
        console.log(err, 'catch err');
        next(err);
    }
});
router.get('/posts', auth_1.authenticateToken, async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const posts = await Posts_1.default.find().sort({ createdAt: -1 }).limit(limitNum).skip((limitNum) * (pageNum - 1)).populate('author', 'username');
        const total_posts = await Posts_1.default.countDocuments();
        res.status(200).json({
            total_posts,
            total_pages: Math.ceil(total_posts / limitNum),
            current_page: pageNum,
            posts,
        });
    }
    catch (err) {
        res.status(500).json('internal server error');
        next(err);
    }
});
router.put("/posts/:id", auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Safely access user ID from token
        const { title, content } = req.body;
        // Find the post
        const post = await Posts_1.default.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Check if the current user is the author
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }
        // Update the post
        post.title = title || post.title;
        post.content = content || post.content;
        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
