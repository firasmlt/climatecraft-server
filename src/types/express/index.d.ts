declare namespace Express {
    interface Request {
        currentUser?: {
            id: string
            firstName: string
            lastName: string
            email: string
        }
    }
}
