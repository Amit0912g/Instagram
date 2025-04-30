import express from "express"
import authentication from "../middlewares/authentication.js";
import { addComment, addNewPost, bookmark, deleteComment, deletePost, getAllPost, getCommentsOfPost, getUserPost, likePost, UnlikePost, userBookmark } from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=express.Router()


router.post("/addpost", authentication, upload.single("image"), addNewPost);
router.get("/all",authentication,getAllPost)
router.get("/userpost/all",authentication,getUserPost)
router.get("/:id/like",authentication,likePost)
router.get("/:id/unlike",authentication,UnlikePost)
router.post("/:id/comment",authentication,addComment)
router.post("/:id/comment/all",authentication,getCommentsOfPost)
router.post("/:id/delete",authentication,deletePost)
router.get("/:id/bookmark",authentication,bookmark)
router.post("/:id/deleteComment",authentication,deleteComment)
router.get('/user/bookmarks', authentication, userBookmark);
  

export default router