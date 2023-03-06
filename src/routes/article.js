import express from 'express';
import jwt from 'jsonwebtoken'
import prisma from '../utils/database.js';
import { v4 as uuidv4 } from 'uuid';

const articleRouter = express.Router();

articleRouter.use((req, res, next) => {
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
        var decoded = jwt.verify(token, 'secret'); // TODO: move secret to env variable
        res.locals.decoded = decoded
    } catch(err) {
        res.json({
            code: 401,
            message: "Token is not valid",
            data: null
        })

        return
      }

   
      

    next()
}) // TODO: move to auth.js later

articleRouter.get("/api/article", async (req, res) => {
    const user = await prisma.user.findFirst({
        where: {
            email: res.locals.decoded.email
        }
    })
    const articles = await prisma.article.findMany({
        where: {
            authorId: user.id
        }
    })

    res.json({
        code: 200,
        message: "Success get articles",
        data: articles
    })
})

articleRouter.post("/api/article", async (req, res) => {
    const { title, content } = req.body

    const user = await prisma.user.findFirst({
        where: {
            email: res.locals.decoded.email
        }
    })

    const article = await prisma.article.create({
        data: {
            id: uuidv4(),
            title: title,
            content: content,
            authorId: user.id,
            createdAt: new Date(),
        }
    })

    res.json({
        code: 200,
        message: "Success create article",
        data: article
    })
})

export default articleRouter