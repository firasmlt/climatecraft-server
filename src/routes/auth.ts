import express from "express"
import { body } from "express-validator"
import AuthController from "../controllers/authController"

const router = express.Router()

router.post(
    "/register",
    body("firstName").isLength({ min: 3, max: 20 }),
    body("lastName").isLength({ min: 3, max: 20 }),
    body("email").isEmail(),
    body("password").isStrongPassword({ minLength: 8, minSymbols: 0 }),
    AuthController.register
)

router.post("/login", AuthController.login)

router.post("/reset", body("email").isEmail(), AuthController.resetPassword)

router.post(
    "/newPassword",
    body("resetToken").notEmpty(),
    body("newPassword").isStrongPassword({ minLength: 8, minSymbols: 0 }),
    AuthController.newPassword
)

router.post(
    "/verifyToken",
    body("resetToken").notEmpty(),
    AuthController.verifyToken
)

export default router
