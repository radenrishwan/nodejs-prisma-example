import express from 'express';
import prisma from '../utils/database.js';
import { v4 as uuidv4 } from 'uuid';
import authMiddleware from '../middleware/auth.js';
import {body} from "express-validator";

const articleRouter = express.Router();

articleRouter.use(authMiddleware) // TODO: move to auth.js later

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

articleRouter.post("/api/article",
    body('title').notEmpty().isLength({min: 8}).withMessage('Title is required or minimum 8 characters'),
    body('content').notEmpty().isLength({min: 8}).withMessage('Content is required, minimum 8 characters'),
    async (req, res) => {
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

articleRouter.get("/api/article/:id", async (req, res) => {
    const article = await prisma.article.findFirst({
        where: {
            id: req.params.id
        }
    })

    res.json({
        code: 200,
        message: "Success get article",
        data: article
    })
})

export default articleRouter