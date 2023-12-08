import * as mongoose from "mongoose"
import CraftType from "../types/craft";


const CraftSchema = new mongoose.Schema<CraftType>({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: true
    },
}, { timestamps: true }
);

const Craft = mongoose.model<CraftType>("Craft", CraftSchema);

export default Craft;
