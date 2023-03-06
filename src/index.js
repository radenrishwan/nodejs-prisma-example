import express from "express"
import articleRouter from "./routes/article.js"
import userRouter from "./routes/user.js"

const app = express()

app.use(express.json())

// bind 
app.use(userRouter)
app.use(articleRouter)

app.listen(3000, () => console.log("Server is running on port 3000"))