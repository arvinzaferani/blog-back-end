import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    username: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    password: string,
    profile_image_url: string,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema: Schema = new Schema({
    username: {type: String, required: true},
    first_name: {type: String, required: false},
    last_name: {type: String, required: false},
    phone_number: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    profile_image_url: {type: String, required: false},
    password: {type: String, required: true},
}, {
    timestamps: true
})

const User = mongoose.model<IUser>('User', UserSchema)
export default User

