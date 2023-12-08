import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { ValidationError, ValidationResult } from "../types/validation"

import User from "../models/UserSchema"

class UserController {
    static getAuthenticatedUserInfo = async (req: Request, res: Response) => {
        try {
            if (!req.currentUser) {
                return res.status(400).json({
                    status: "error",
                    message: "invalid token",
                })
            }

            const user = await User.findById(req.currentUser.id)
            if (user) {
                return res.status(200).json({
                    status: "success",
                    message: "user fetched successfully",
                    data: {
                        user: {
                            id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            userTypeId: user.userTypeId,
                            createdAt: user.createdAt,
                        },
                    },
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
    static updateUser = async (req: Request, res: Response) => {
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

            const userData = req.body
            if (!req.currentUser) {
                return res.status(400).json({
                    status: "error",
                    message: "invalid token",
                })
            }

            // const isMatch = await bcrypt.compare(
            //     userData.currentPassword,
            //     req.currentUser?.password || ""
            // );

            // if (!isMatch) {
            //     return res.status(401).json({
            //         status: "error",
            //         message: "incorrect currentPassword",
            //     });
            // }

            // userData.password = await bcrypt.hash(userData.password, 10);

            // const user = await User.findByIdAndUpdate(req.currentUser?._id, {
            //     ...userData,
            //     // currentPassword: null,
            // });

            const user = await User.findByIdAndUpdate(req.currentUser.id, {
                firstName: userData.firstName,
                lastName: userData.lastName,
            })

            if (!user) {
                return res.status(500).json({
                    status: "error",
                    message: "internal server error",
                    data: null,
                })
            }

            res.status(200).json({
                status: "success",
                message: "user updated successfully",
                data: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    userTypeId: user.userTypeId,
                    createdAt: user.createdAt,
                },
            })
        } catch (err: any) {
            if (err?.keyValue) {
                return res.status(400).json({
                    status: "error",
                    message: `${
                        Object.keys(err.keyValue)[0]
                    } already in use by another user`,
                })
            }
            console.log(err)

            res.status(500).json({
                status: "error",
                message: "internal server error",
            })
        }
    }
}

export default UserController
