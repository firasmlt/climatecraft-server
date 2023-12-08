import express from "express"
import { body } from "express-validator"
import AuthController from "../controllers/authController"
import AuthMiddleware from "../middlewares/Auth"
import UserController from "../controllers/userController"
const router = express.Router()

router.get(
    "/me",
    AuthMiddleware.validate,
    UserController.getAuthenticatedUserInfo
)

export default router
