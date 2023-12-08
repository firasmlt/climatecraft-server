import express from "express"
import { body } from "express-validator"
import CraftController from "../controllers/craftController"
import AuthMiddleware from "../middlewares/Auth"
// import fileUpload from "express-fileupload"s

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
router.get("/mycrafts", AuthMiddleware.validate, CraftController.getAllUserCrafts)
router.get("/", AuthMiddleware.validate, CraftController.getAllCrafts)
router.get("/:id", AuthMiddleware.validate, CraftController.getOneCraft)
// router.post(
//     "/upload-craft-photo",
//     fileUpload({ createParentPath: false }),
//     AuthMiddleware.validate,
//     CraftController.uploadCraftPhoto
// );

export default router
