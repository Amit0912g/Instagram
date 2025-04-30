import express from "express"
import { editProfile, followOrUnfollow, getProfile, getsuggestedUsers, login, logout, register } from "../controllers/user.controllers.js"
import authentication from "../middlewares/authentication.js"
import { upload } from "../middlewares/multer.middleware.js"
import rateLimit from "express-rate-limit"
const router=express.Router()

router.post("/register",register)
router.post("/login",rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: "Too many login attempts"
}),login)
router.get("/logout",logout)
router.get("/:id/profile",authentication,getProfile)
router.post("/profile/edit",authentication,upload.single("profilePicture"),editProfile)
router.get("/suggested",authentication,getsuggestedUsers)
router.post("/followOrUnfollow/:id",authentication,followOrUnfollow)

export default router

