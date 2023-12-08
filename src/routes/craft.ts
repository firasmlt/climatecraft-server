import express from "express"
import { body } from "express-validator"
import CraftController from "../controllers/craftController"
import AuthMiddleware from "../middlewares/Auth"

const router = express.Router()

router.post(
    "/",

    AuthMiddleware.validate,

    body("title").isLength({ min: 3, max: 30 }),
    body("description").isLength({ min: 3, max: 500 }),
    body("photoUrl").isString(),
    

    CraftController.createCraft
)
router.patch(
    "/:id",
    AuthMiddleware.validate,
    body("title").isLength({ min: 3, max: 30 }),
    body("description").isLength({ min: 3, max: 500 }),
    body("photoUrl").isString(),
    CraftController.updateCraft
)

router.delete("/:id", AuthMiddleware.validate, CraftController.deleteCraft)
router.get("/", AuthMiddleware.validate, CraftController.getAllUserCrafts)
router.get("/:id", AuthMiddleware.validate, CraftController.getOneCraft)

export default router
