import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { FaBookmark } from "react-icons/fa";
import { toggleBookmark } from "@/redux/bookmarkSlice";
const Post = ({ post }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
  const [likedPost, setLikedPost] = useState(post?.likes.length);
  const [comment,setComment]=useState(post.comments)
  const { bookmarks } = useSelector((state) => state.bookmark);
  const bookmarked = bookmarks.includes(post?._id);
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const bookmarkHandler=async()=>{
    try {
      const res=await axios.get(`/post/${post?._id}/bookmark`,{withCredentials:true})
      if(res.data.success){
        toast.success(res.data.message)
        dispatch(toggleBookmark(post?._id));
      }
    } catch (error) {
      console.log(error)
    }
  }
  const likeDislikePost = async () => {
    const action = liked ? "unlike" : "like";
    try {
      const res = await axios.get(`/post/${post._id}/${action}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const updatedLikes = liked ? likedPost - 1 : likedPost + 1;
        setLikedPost(updatedLikes);
        setLiked(!liked);

        const updatedPost = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPost));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deletePostHandler = async () => {
    try {
      const res = await axios.post(`/post/${post?._id}/delete`, {
        withCredentials: true,
      });
      const updatedPosts = posts.filter((item) => item._id !== post._id);
      dispatch(setPosts(updatedPosts));
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const commentHandler=async()=>{
    
    try {
      const res = await axios.post(`/post/${post?._id}/comment`,{text}, {
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials: true,
      });
      if(res.data.success){
        const updatedCommentdata=[...comment,res.data.comment]
        setComment(updatedCommentdata)

        const updatedpostdata= posts.map(p=>
          p._id === post._id ? {
            ...p,comments:updatedCommentdata
          }:p
        )
        setText("")
        dispatch(setPosts(updatedpostdata))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-full max-w-sm mx-auto my-12 overflow-hidden sm:w-56 lg:w-96 lg:-ml-20 sm:-ml-20 md:w-72 md:-ml-10 ">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post?.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-medium">{post?.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer"></MoreHorizontal>
          </DialogTrigger>

          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
            post?.author?._id !== user?._id && <Button
            variant="ghost"
            className="cursor-pointer w-fit text-[#ed4956] font-semibold"
          >
            Unfollow
          </Button>
            }
            
            <Button
              variant="ghost"
              className="text-black cursor-pointer w-fit "
            >
              Add to favourites
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="text-black cursor-pointer w-fit "
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className=" lg:h-4/5 lg:w-96 sm:w-56 sm:h-3/5 md:w-72 md:h-4/6 w-72">
        {!imageLoaded && (
          <div className="w-full h-full flex items-center mt-1 mb-1 justify-center lg:p-32 sm:p-20 p-12 bg-[#222121] rounded-sm">
            <div className="w-10 h-10 border-4 border-gray-400 rounded-full border-t-white animate-spin"></div>
          </div>
        )}
        <img
          className={ ` w-full h-full my-2 bg-no-repeat object-cover rounded-sm ${
            !imageLoaded ? "hidden" : ""
          }`}
          loading="lazy"
          src={post?.image}
          onLoad={() => setImageLoaded(true)}
          alt="post_image"
        />
      </div>

      <div className="flex items-center justify-between my-1">
        <div className="flex items-center gap-3">
          {
           liked ? <FaHeart onClick={likeDislikePost} className="w-6 h-6 text-red-600 cursor-pointer lg:w-6 lg:h-6 md:w-5 md:h-5 sm:h-4 sm:w-4"></FaHeart> : <FaRegHeart
           onClick={likeDislikePost}
           className="w-6 h-6 cursor-pointer hover:text-gray-500 lg:w-6 lg:h-6 md:w-5 md:h-5 sm:h-4 sm:w-4"
         ></FaRegHeart>
          }
          
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post))
              setOpen(true)}}
            className="w-6 h-6 cursor-pointer hover:text-gray-500 lg:w-6 lg:h-6 md:w-5 md:h-5 sm:h-4 sm:w-4"
          ></MessageCircle>
          <Send className="w-6 h-6 cursor-pointer hover:text-gray-500 lg:w-6 lg:h-6 md:w-5 md:h-5 sm:h-4 sm:w-4"></Send>
        </div>
        {
        bookmarked ? <FaBookmark onClick={bookmarkHandler} className="w-5 h-5 cursor-pointer hover:text-gray-400"></FaBookmark> :  <Bookmark onClick={bookmarkHandler} className="w-6 h-6 cursor-pointer hover:text-gray-500 lg:w-6 lg:h-6 md:w-5 md:h-5 sm:h-4 sm:w-4"></Bookmark>
        }
       
      </div>
      {likedPost > 0 && (
        <span className="block mb-2 text-sm font-medium sm:text-xs md:text-sm lg:text-base">
          {likedPost} likes
        </span>
      )}
      <p>
        <span className="mr-2 font-semibold ">{post?.author?.username}</span>
        {post?.caption}
      </p>
      {post?.comments?.length > 0 && (
        <span
        onClick={() => {
          dispatch(setSelectedPost(post))
          setOpen(true)}}
          className="text-gray-400 cursor-pointer"
        >
          View all {post?.comments?.length} comments
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} ></CommentDialog>
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();  
              commentHandler();    
            }
          }}
          onChange={changeEventHandler}
          placeholder="Add a comment"
          className="w-full p-1 text-sm text-white placeholder-gray-400 bg-black rounded-md outline-none sm:text-xs md:text-sm lg:text-base"
        ></input>
        {text && <span onClick={commentHandler} className="text-[#3badf8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;
