import { Request, Response } from "express"
import bcrypt from "bcrypt"
import userSchema from "../models/UserSchema"
import { validationResult } from "express-validator"
import { ValidationError, ValidationResult } from "../types/validation"
import { sendPasswordResetEmail } from "../services/email"
import crypto from "crypto"
import axios from "axios"

class AuthController {
    static register = async (req: Request, res: Response) => {
        try {
            const validationResults = validationResult(
                req
            ) as unknown as ValidationResult
            const errors: ValidationError[] =
                (validationResults?.errors as ValidationError[]) || []
            if (errors.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: `invalid ${errors[0]?.path} : ${errors[0]?.value}`,
                })
            }

            const { firstName, lastName, email, password } =
                req.body

            const user = new userSchema({
                firstName,
                lastName,
                email: email.toLowerCase(),
                password,
                createdAt: new Date(Date.now()),
            })
            user.password = await bcrypt.hash(password, 10)
            await user.save()
            const token = user.generateAuthToken()
            res.status(200).json({
                status: "success",
                message: "user created successfully",
                data: {
                    token,
                },
            })
        } catch (err: any) {
            if (err?.keyValue) {
                return res.status(400).json({
                    status: "error",
                    message: `${Object.keys(err.keyValue)[0]} already in use`,
                    data: null,
                })
            }
            console.log(err)

            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }


    static login = async (req: Request, res: Response) => {
        try {
            const validationResults = validationResult(
                req
            ) as unknown as ValidationResult
            const errors: ValidationError[] =
                (validationResults?.errors as ValidationError[]) || []
            if (errors.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: `invalid ${errors[0]?.path} : ${errors[0]?.value}`,
                    data: null,
                })
            }

            const { email, password } = req.body

            const user = await userSchema.findOne({
                email: email.toLowerCase(),
            })
            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "user not found",
                    data: null,
                })
            }

            const valid = await bcrypt.compare(password, user.password)
            if (!valid) {
                return res.status(401).json({
                    status: "error",
                    message: "invalid password",
                    data: null,
                })
            }
            const token = user.generateAuthToken()
            res.status(200).json({
                status: "success",
                message: "user logged in successfully",
                data: {
                    token,
                },
            })
        } catch (err: any) {
            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }

    static resetPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const user = await userSchema.findOne({
                email: email.toLowerCase(),
            })
            if (!user) {
                res.status(404).json({
                    status: "error",
                    message: "no user found with that email address",
                    data: null,
                })
            } else {
                // create a random token
                const resetToken = crypto.randomBytes(20).toString("hex")
                user.resetToken = resetToken
                user.resetTokenExpiration = new Date(Date.now() + 3600000)
                await user.save()
                // Send email to user with the reset link
                await sendPasswordResetEmail(resetToken, user?.email)
                res.status(200).json({
                    status: "success",
                    message: "email sent successfully",
                    data: null,
                })
            }
        } catch (err: any) {
            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }

    static newPassword = async (req: Request, res: Response) => {
        try {
            const validationResults = validationResult(
                req
            ) as unknown as ValidationResult
            const errors: ValidationError[] =
                (validationResults?.errors as ValidationError[]) || []
            if (errors.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: `invalid ${errors[0]?.path} : ${errors[0]?.value}`,
                    data: null,
                })
            }

            const { resetToken, newPassword } = req.body

            const user = await userSchema.findOne({
                resetToken: resetToken,
                resetTokenExpiration: { $gt: Date.now() },
            })

            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "invalid token",
                    data: null,
                })
            }

            const sameAsPrevious = await bcrypt.compare(
                newPassword,
                user.password
            )

            if (sameAsPrevious) {
                return res.status(400).json({
                    status: "error",
                    message: `cannot use previous password`,
                    data: null,
                })
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            user.password = hashedPassword
            user.resetToken = null
            user.resetTokenExpiration = null
            await user.save()
            return res.status(200).json({
                status: "success",
                message: "password updated",
                data: null,
            })
        } catch (err: any) {
            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }
    static verifyToken = async (req: Request, res: Response) => {
        try {
            const validationResults = validationResult(
                req
            ) as unknown as ValidationResult
            const errors: ValidationError[] =
                (validationResults?.errors as ValidationError[]) || []
            if (errors.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: `invalid token`,
                    data: null,
                })
            }

            const { resetToken } = req.body

            const user = await userSchema.findOne({
                resetToken: resetToken,
                resetTokenExpiration: { $gt: Date.now() },
            })

            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "invalid token",
                    data: null,
                })
            }

            return res.status(200).json({
                status: "success",
                message: "token is valid",
                data: null,
            })
        } catch (err: any) {
            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }
}

export default AuthController
