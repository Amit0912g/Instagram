import express from "express"
import { getMessage, sendMessage } from "../controllers/message.controllers.js"
import authentication from "../middlewares/authentication.js"
const router=express.Router()

router.post("/send/:id",authentication,sendMessage)
router.get("/all/:id",authentication,getMessage)

export default router