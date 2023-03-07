import jwt from 'jsonwebtoken';

const generateToken = ({ name, email }) => {
    const token = jwt.sign({
        name: name,
        email: email,
    }, process.env.SECRET_KEY, {
        expiresIn: 60 * 60,
        algorithm: 'HS256'
    }) 

    return token
}

const verifyToken = ({ token }) => {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    return decoded
}

export {
    generateToken,
    verifyToken
}