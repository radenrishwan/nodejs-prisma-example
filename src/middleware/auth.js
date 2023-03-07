import { verifyToken } from "../utils/jwt.js"

const authMiddleware = (req, res, next) => {
    // get bearer token
    const bearerHeader = req.headers['authorization']

    if (bearerHeader === undefined) {
        res.json({
            code: 401,
            message: "Unauthorized",
            data: null
        })

        return
    }

    const [key, token] = bearerHeader.split(' ')

    if (key.toLocaleLowerCase() !== "bearer") {
        res.json({
            code: 401,
            message: "Token is not valid",
            data: null
        })

        return
    }

    try {
        const decoded = verifyToken({ token })
        res.locals.decoded = decoded

        next()
    } catch (err) {
        res.json({
            code: 401,
            message: err.message,
            data: null
        })

        return
    }
}

export default authMiddleware