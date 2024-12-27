import mongoose, {Schema, Document} from "mongoose";

export interface IPost extends Document {
    author: mongoose.Schema.Types.ObjectId,
    title: string,
    content: string,
    keywords: string[],
    createdAt: Date,
}

const PostSchema: Schema = new Schema({
    content: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    keywords: {type: [String], required: true},
    createdAt: {type: Date, default: Date.now},
}, {timestamps: true})
const Post = mongoose.model<IPost>('Post', PostSchema)
export default Post
