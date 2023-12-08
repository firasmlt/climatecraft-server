import mongoose from "mongoose"

const connection = async () => {
    try {
        mongoose.set("strictQuery", false)
        if (!process.env.URI_STRING) {
            throw "No Database URI String Provided In Env File"
        }
        await mongoose.connect(process.env.URI_STRING || "")
        console.log("Connected Successfully!")
        return true
    } catch (err) {
        console.error(err)
        console.log(process.env.URI_STRING)
        return false
    }
}

export { connection }
