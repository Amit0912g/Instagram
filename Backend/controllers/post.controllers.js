import uploadonCloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/user.models.js";
import { Comment } from "../models/comment.models.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const {path} = req.file;
    
    const myId = req.id;
    if (!path) res.status(400).json({ success: false, messgae: "Image Required" });

    const response = await uploadonCloudinary(path);


    const post = await Post.create({
      caption,
      image: response.secure_url,
      author: myId,
    });
    const user = await User.findById(myId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
   await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      success: true,
      message: "new post created",
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username , profilePicture" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: {
        path: "author",
        select: "username , profilePicture",
      },
    });
  return res.status(200).json({
    success: true,
    posts,
  });
};

export const getUserPost=async(req,res)=>{
    try {
       const myId=req.id
       const posts=await Post.find({author:myId}).sort({createdAt:-1}).populate({ path: "author", select: "username , profilePicture" })
       .populate({
         path: "comments",
         sort: { createdAt: -1 },
         populate: {
           path: "author",
           select: "username , profilePicture",
         },
       }); 
       return res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
        console.log(error)
    }
}

export const likePost=async(req,res)=>{
    const myId=req.id
    const postId=req.params.id
    const post=await Post.findById(postId)
    if(!post) res.status(400).json({success:false,message:"post not found"})
     
      await post.updateOne({$addToSet:{likes:myId}}) ;
      await post.save() 

      const user=await User.findById(myId).select("username profilePicture")
      const postOwnerId=post.author.toString()
      let notification;
      if(postOwnerId !== myId){

         notification={
          type:"like",
          userId:myId,
          userDetails:user,
          postId,
          message:"your  post was liked"
        }
      }
      const postOwnerSocketId=getReceiverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit("notification",notification)
      return res.status(200).json({
        success: true,
        message:"Post liked",
      });
}

export const UnlikePost=async(req,res)=>{
    const myId=req.id
    const postId=req.params.id
    const post=await Post.findById(postId)
    if(!post) res.status(400).json({success:false,message:"post not found"})
     
      await post.updateOne({$pull:{likes:myId}}) ;
      await post.save() 
      const user=await User.findById(myId).select("username profilePicture")
      const postOwnerId=post.author.toString()
      let notification; 
      if(postOwnerId !== myId){

         notification={
          type:"unlike",
          userId:myId,
          userDetails:user,
          postId,
          message:"your  post was unliked"
        }
      }
      const postOwnerSocketId=getReceiverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit("notification",notification)
      return res.status(200).json({
        success: true,
        message:"Post Unliked",
      });
}

export const addComment=async(req,res)=>{
    try {
        const myId=req.id;
        const postId=req.params.id;
        const {text}=req.body

        if(!text) res.status(400).json({success:false,message:"please enter the text"})
        const post= await Post.findById(postId)
        
        let comment = await Comment.create({
          text,
          author: myId,
          post: postId
        });
    
        comment = await comment.populate({
          path: "author",
          select: "username profilePicture"
        });
    

        post.comments.push(comment._id)
        await post.save()

        return res.status(200).json({success:true,message:"comment added",comment})

    } catch (error) {
        console.log(error);
    }
}

export const getCommentsOfPost=async(req,res)=>{
    try {
        const postId=req.params.id
        const comment=await Comment.find({post:postId}).populate({
            path:"author",
            select:"username , profilePicture"
        })
        if(!comment) res.status(400).json({success:false,message:"no comment found"})

        return res.status(200).json({success:true,message:"comment found",comment})

    } catch (error) {
     console.log(error)   
    }
}

export const deletePost=async(req,res)=>{
    const myId=req.id
    const postId=req.params.id

    const post= await Post.findById(postId)
    if(!post) res.status(400).json({success:false,message:"no post found"})
     
    if(post.author.toString() !== myId)  res.status(400).json({success:false,message:"not authorized"})

        await Post.findByIdAndDelete(postId)
      const user= await User.findById(myId)
      user.posts= user.posts.filter(id=> id.toString() != postId  )
      await user.save()

     await Comment.deleteMany({post:postId})
  return  res.status(200).json({success:true,message:"post deleted"})

}

export const bookmark=async(req,res)=>{
   try {
     let myId=req.id
     let postId=req.params.id
     const post= await Post.findById(postId)
     if(!post) res.status(400).json({success:false,message:"no post found"})
     let user=await User.findById(myId)
     if(user.bookmarks.includes(postId)){
         await user.updateOne({$pull:{bookmarks:post._id}})
         await user.save()
         res.status(200).json({success:true,type:"saved",message:" post removed from bookmark"})
     }
     else{
         
             await user.updateOne({$addToSet:{bookmarks:post._id}})
             await user.save()
             res.status(200).json({success:true,type:"saved",message:" post added to bookmark"})
          }
   } catch (error) {
    console.log(error)
   }
}

export const deleteComment=async(req,res)=>{
  const myId=req.id
  const commentId=req.params.id

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ success: false, message: "Comment not found" });
  }

  const post = await Post.findById(comment.post);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  const isCommentAuthor = comment.author.toString() === myId;
  const isPostAuthor = post.author.toString() === myId;

  if (!isCommentAuthor && !isPostAuthor) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: comment._id }
  });

  await Comment.findByIdAndDelete(commentId);
  return res.status(200).json({success:true,message:"Comment deleted"})

}
export const userBookmark=async (req, res) => {
  try {
    const user = await User.findById(req.id).select('bookmarks');
    res.json({ success: true, bookmarks: user.bookmarks }); 
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load bookmarks' });
  }
}