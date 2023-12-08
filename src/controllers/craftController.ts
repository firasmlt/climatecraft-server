import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { ValidationError, ValidationResult } from "../types/validation"
import CraftType from "../types/craft"
import CraftSchema from "../models/CraftSchema"
import { isValidObjectId } from "mongoose"

class CraftController {
    static createCraft = async (req: Request, res: Response) => {
        try {
            const validationResults = validationResult(
                req
            ) as unknown as ValidationResult
            console.log(validationResults)
            const errors: ValidationError[] =
                (validationResults?.errors as ValidationError[]) || []
            if (errors.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: `invalid ${errors[0]?.path} : ${errors[0]?.value}`,
                    data: null,
                })
            }

            const { title, description, photoUrl } = req.body

            if (!req.currentUser) {
                return res.status(401).json({
                    status: "error",
                    message: "unauthorized",
                    data: null,
                })
            }


            const newCraft = new CraftSchema<CraftType>({
                title: !title ? "Untitled Flow" : title,
                description: !description ? "no description." : description,
                
                photoUrl,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
                userId: req.currentUser.id,
            })

            await newCraft.save()

            res.status(200).json({
                status: "success",
                message: "craft created successfully",
                data: {
                    id: newCraft._id,
                    title: newCraft.title,
                    description: newCraft.description,
                    photoUrl: newCraft.photoUrl,
                    userId: newCraft.userId,
                    createdAt: newCraft.createdAt,
                    updatedAt: newCraft.updatedAt,
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
            console.log("errr", err)
            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }
    static updateCraft = async (req: Request, res: Response) => {
        try {
            const validationResults = validationResult(
                req
            ) as unknown as ValidationResult
            console.log(validationResults)
            const errors: ValidationError[] =
                (validationResults?.errors as ValidationError[]) || []
            if (errors.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: `invalid ${errors[0]?.path} : ${errors[0]?.value}`,
                    data: null,
                })
            }

            const { title, description, photoUrl } = req.body
            const { id } = req.params

            if (!req.currentUser) {
                return res.status(401).json({
                    status: "error",
                    message: "unauthorized",
                    data: null,
                })
            }
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    status: "error",
                    message: "invalid craft ID",
                    data: null,
                })
            }
            const craft = await CraftSchema.findById(id)
            if (!craft) {
                return res.status(404).json({
                    status: "error",
                    message: "craft not found",
                    data: null,
                })
            }

            if (craft.userId !== req.currentUser.id) {
                return res.status(401).json({
                    status: "error",
                    message: "unauthorized",
                    data: null,
                })
            }

            craft.title = !title ? "Untitled craft" : title
            craft.description = !description ? "no description" : description
            craft.photoUrl = photoUrl

            craft.updatedAt = new Date(Date.now())

            const updatedCraft = await craft.save()

            res.status(200).json({
                status: "success",
                message: "craft updated successfully",
                data: {
                    id: updatedCraft._id,
                    title: updatedCraft.title,
                    description: updatedCraft.description,
                    photoUrl: updatedCraft.photoUrl,
                    userId: updatedCraft.userId,
                    createdAt: updatedCraft.createdAt,
                    updatedAt: updatedCraft.updatedAt,
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
            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }
    static deleteCraft = async (req: Request, res: Response) => {
        try {
            const validationResults = validationResult(
                req
            ) as unknown as ValidationResult
            console.log(validationResults)
            const errors: ValidationError[] =
                (validationResults?.errors as ValidationError[]) || []
            if (errors.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: `invalid ${errors[0]?.path} : ${errors[0]?.value}`,
                    data: null,
                })
            }

            const { id } = req.params

            if (!req.currentUser) {
                return res.status(401).json({
                    status: "error",
                    message: "unauthorized",
                    data: null,
                })
            }
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    status: "error",
                    message: "invalid craft ID",
                    data: null,
                })
            }
            const craft = await CraftSchema.findById(id)
            console.log(craft)
            if (!craft) {
                return res.status(404).json({
                    status: "error",
                    message: "craft not found",
                    data: null,
                })
            }

            if (craft.userId !== req.currentUser.id) {
                return res.status(401).json({
                    status: "error",
                    message: "unauthorized",
                    data: null,
                })
            }

            await CraftSchema.findByIdAndDelete(id)

            res.status(200).json({
                status: "success",
                message: "craft deleted successfully",
                data: null,
            })
        } catch (err: any) {
            if (err?.keyValue) {
                return res.status(400).json({
                    status: "error",
                    message: `${Object.keys(err.keyValue)[0]} already in use`,
                    data: null,
                })
            }
            console.log("errr", err)
            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }

    static getOneCraft = async (req: Request, res: Response) => {
        try {
            const validationResults = validationResult(
                req
            ) as unknown as ValidationResult
            console.log(validationResults)
            const errors: ValidationError[] =
                (validationResults?.errors as ValidationError[]) || []
            if (errors.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: `invalid ${errors[0]?.path} : ${errors[0]?.value}`,
                    data: null,
                })
            }

            const { id } = req.params

            if (!req.currentUser) {
                return res.status(401).json({
                    status: "error",
                    message: "unauthorized",
                    data: null,
                })
            }
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    status: "error",
                    message: "invalid craft ID",
                    data: null,
                })
            }
            const craft = await CraftSchema.findById(id)
            if (!craft) {
                return res.status(404).json({
                    status: "error",
                    message: "craft not found",
                    data: null,
                })
            }

            if (craft.userId !== req.currentUser.id) {
                return res.status(401).json({
                    status: "error",
                    message: "unauthorized",
                    data: null,
                })
            }

            const formattedFlow = {
                id: craft._id,
                title: craft.title,
                description: craft.description,
                photoUrl: craft.photoUrl,
                userId: craft.userId,
                createdAt: craft.createdAt,
                updatedAt: craft.updatedAt,
            }

            res.status(200).json({
                status: "success",
                message: "craft fetched successfully",
                data: formattedFlow,
            })
        } catch (err: any) {
            if (err?.keyValue) {
                return res.status(400).json({
                    status: "error",
                    message: `${Object.keys(err.keyValue)[0]} already in use`,
                    data: null,
                })
            }
            console.log("errr", err)
            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }

    static getAllUserCrafts = async (req: Request, res: Response) => {
        try {
            const validationResults = validationResult(
                req
            ) as unknown as ValidationResult
            console.log(validationResults)
            const errors: ValidationError[] =
                (validationResults?.errors as ValidationError[]) || []
            if (errors.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: `invalid ${errors[0]?.path} : ${errors[0]?.value}`,
                    data: null,
                })
            }

            if (!req.currentUser) {
                return res.status(401).json({
                    status: "error",
                    message: "unauthorized",
                    data: null,
                })
            }

            const crafts = await CraftSchema.find({
                userId: req.currentUser.id,
            })

            const formattedCrafts = crafts.map((craft: CraftType) => {
                return {
                    id: craft._id,
                    title: craft.title,
                    description: craft.description,
                    photoUrl: craft.photoUrl,
                    userId: craft.userId,
                    createdAt: craft.createdAt,
                    updatedAt: craft.updatedAt,
                }
            })

            res.status(200).json({
                status: "success",
                message: "user crafts fetched successfully",
                data: formattedCrafts,
            })
        } catch (err: any) {
            if (err?.keyValue) {
                return res.status(400).json({
                    status: "error",
                    message: `${Object.keys(err.keyValue)[0]} already in use`,
                    data: null,
                })
            }
            console.log("errr", err)
            res.status(500).json({
                status: "error",
                message: "internal server error",
                data: null,
            })
        }
    }
}

export default CraftController
