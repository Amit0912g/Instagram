import {User} from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/jwt.js";
import uploadonCloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.models.js";
export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ success: false, message: "email already present" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashPassword,
      username,
    });
    return res.status(200).json({ success: true, message: newUser });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "email is incorrect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "password is incorrect" });
    }

    const token = await generateToken(user._id);
  
    const populatedPost=await Promise.all(
      user.posts.map(async(postId)=>{
        const post= await Post.findById(postId)
        if(post && post.author && post.author.equals(user._id)) {
          return post
        } 
        return null
      })
    )
    const newuser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      gender: user.gender,
      followers: user.followers,
      following: user.following,
      post: populatedPost,
      bookmarks: user.bookmarks,
    };
    return res
      .cookie("token", token, {
        httpOnly: true, 
        secure: true,
        sameSite: "none",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, message: `Welcome back ${user.username}`, newuser });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (_, res) => {
  try {
    res
      .clearCookie("token", "", {
        maxAge: 0,
      })
      .status(200)
      .json({ success: true, message: "user logout" });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate({path:'posts',createdAt:"-1"}).populate('bookmarks')
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "user found", user });
  } catch (error) {}
};

export const editProfile = async (req, res) => {
  try {
    let userId = req.id;
    const { bio, gender } = req.body;
    
    let profilePicUrl = null;

    if (req.file?.path) {
      const response = await uploadonCloudinary(req.file.path);
      profilePicUrl = response.secure_url;
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicUrl) user.profilePicture = response.secure_url;

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);
  }
};

export const getsuggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUser) {
      return res
        .status(400)
        .json({ success: false, message: "Currently do not have any user" });
    }

    return res.status(200).json({ success: true, suggestedUser });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow=async(req,res)=>{
  try {
    const myId=req.id;
    const followingId=req.params.id;
    if(myId===followingId){
    return res.status(400).json({ success: false, message:"you cannot follow or unfollow yourself" });
    }
    const user=await User.findById(myId)
    const targetUser=await User.findById(followingId)

    if(!user || !targetUser){
    return res.status(400).json({ success: false, message:"User not found" });
    }
    const isFollowing=user.following.includes(followingId)
    if(isFollowing){
     await Promise.all([
      User.updateOne({_id:myId},{$pull:{following:followingId}}),
      User.updateOne({_id:followingId},{$pull:{followers:myId}}),
     ])
     return res.status(200).json({ success: true, message:"Unfollowed Successfully" });

    }
    else{
     await Promise.all([
      User.updateOne({_id:myId},{$push:{following:followingId}}),
      User.updateOne({_id:followingId},{$push:{followers:myId}})

     ])
    return res.status(200).json({ success: true, message:"followed Successfully" });

    }
  } catch (error) {
    console.log(error)
  }
}
