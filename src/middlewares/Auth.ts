import { Request, Response, NextFunction } from "express"
import UserSchema from "../models/UserSchema"
import jwt, { Secret, JwtPayload } from "jsonwebtoken"

class Auth {
    static validate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req?.headers?.authorization) {
                return res.status(401).json({
                    status: "error",
                    message: "not authorized",
                })
            }
            if (req.headers.authorization.split(" ").length <= 1) {
                return res.status(401).json({
                    status: "error",
                    message: "not authorized",
                })
            }
            const token = req.headers.authorization.split(" ")[1]
            const { _id } = jwt.verify(
                token,
                process.env.JWT_PRIVATE_KEY as Secret
            ) as JwtPayload

            let user = await UserSchema.findById(_id)
            if (!user) {
                return res.status(401).json({
                    status: "error",
                    message: "not authorized",
                })
            }

            req.currentUser = {
                id: String(user._id),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }

            console.log(req.currentUser)

            next()
        } catch (err: any) {
            if (
                err?.message?.includes("invalid signature") ||
                err?.message?.includes("jwt malformed")
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "invalid token",
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

export default Auth
