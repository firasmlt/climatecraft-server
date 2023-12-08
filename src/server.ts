require("dotenv").config()
import express, { Application } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import rateLimit, { MemoryStore } from "express-rate-limit"
import helmet from "helmet"
import crypto from "crypto"
import { connection } from "./services/db"
import authRoutes from "./routes/auth"
import craftRoutes from "./routes/craft"
import usersRoutes from "./routes/users"

const app: Application = express()

// rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.ENV === "DEV" ? 1555 : 100,
    standardHeaders: true,
    store: new MemoryStore(),
    statusCode: 429,
    message: {
        status: "error",
        message: "too many requests, try again later",
    },
})

const corsOptions = {
    origin: process.env.DOMAIN_CLIENT,
}

// middlewares
app.use(bodyParser.json())
app.use(express.json())
app.use(cors(corsOptions))
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.disable("x-powered-by")

// routes
app.use("/v1/auth", limiter, authRoutes)
app.use("/v1/craft", craftRoutes)
app.use("/v1/users", usersRoutes)

app.use("/v1/uploads", express.static("uploads"))

// port
const port: number = Number(process.env.PORT) || 3500

// start server
app.listen(port, async () => {
    // database connection
    console.log("connection to database in progress...")
    await connection()
    console.log(`SERVER RUNNING ON PORT ${port}...`)
})
