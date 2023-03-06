const authMiddleware = (req, res, next) => {
    // get bearer token
    const bearerHeader = req.headers['authorization']

    console.log(bearerHeader)

    next()
}

export { authMiddleware }