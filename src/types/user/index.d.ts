import mongoose from "mongoose"

export default interface IUser {
    _id?: string
    firstName: string
    lastName: string
    email: string
    password: string
    resetToken: string | null
    resetTokenExpiration: Date | null
    userTypeId: number
    createdAt: Date;
    updatedAt: Date;
    generateAuthToken: () => string
    generateConfirmationToken: () => string
}
