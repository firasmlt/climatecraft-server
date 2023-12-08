import * as mongoose from "mongoose"
import IUser from "../types/user"
import crypto from "crypto"
import jwt, { Secret } from "jsonwebtoken"

const userSchema = new mongoose.Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpiration: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
})

userSchema.methods.generateAuthToken = function (): string {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWT_PRIVATE_KEY as Secret
    )
    return token
}

const User = mongoose.model<IUser>("User", userSchema)

export default User
