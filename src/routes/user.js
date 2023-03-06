import express from 'express';
import prisma from '../utils/database.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { saltRounds, bcrypt } from '../utils/password.js';

const userRouter = express.Router();

// EXAMPLE TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoib29vIiwiZW1haWwiOiJ5YW1pc29rdjNAZ21haWwuY29tIiwiaWF0IjoxNjc4MTE3MDMzLCJleHAiOjE2NzgxMjA2MzN9.vOJo5Zg00GzdAk2nuQczLFG_z4wQCu2-jy91szl8STU

userRouter.post('/api/user/register', async (req, res) => {
    const { name, password, email } = req.body;

    // check if email already exist
    const old = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
            ]
        },
    })

    if (old > 0) {
        res.json({
            code: 400,
            message: "Email or name already exist",
            data: null
        })

        return
    }

    // create token
    const token = jwt.sign({
        name: name,
        email: email,
    }, 'secret', {
        expiresIn: 60 * 60,
        algorithm: 'HS256'
    }) // TODO: change secret to env variable

    // create user
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        const user = await prisma.user.create({
            data: {
                id: uuidv4(),
                name: name,
                password: hash,
                email: email,
            }
        })

        res.json({
            code: 200,
            message: "User created successfully",
            data: {
                name: user.name,
                email: user.email,
                token: token
            }
        })
    })
})

userRouter.post('/api/user/login', async (req, res) => {
    const { password, email } = req.body;

    // check if email already exist
    const user = await prisma.user.findFirst({
        where: {
            email: email,
        },
    })

    if (user === null) {
        res.json({
            code: 404,
            message: "Email does not exist",
            data: null
        })

        return
    }

    // check if password is correct
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        res.json({
            code: 400,
            message: "Password is incorrect",
            data: null
        })

        return
    }

    // create token
    const token = jwt.sign({
        name: user.name,
        email: user.email,
    }, 'secret', {
        expiresIn: 60 * 60,
        algorithm: 'HS256'
    }) // TODO: change secret to env variable

    res.json({
        code: 200,
        message: "User created successfully",
        data: {
            name: user.name,
            email: user.email,
            token: token
        }
    })
})

export default userRouter;