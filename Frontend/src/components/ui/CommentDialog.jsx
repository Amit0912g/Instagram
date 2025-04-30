import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "../../utils/axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";


const CommentDialog = ({ open, setOpen }) => {
      const [text,setText]=useState("")
      const {selecetedPost,posts}=useSelector(state=>state.post)
        const [comment,setComment]=useState([])
        const dispatch=useDispatch()
      
        useEffect(()=>{
          if(selecetedPost){
            setComment(selecetedPost.comments)
          }
        },[selecetedPost])
      const changeEventHandler=(e)=>{
        const inputText=e.target.value
        if(inputText.trim()){
          setText(inputText)
        }else{
          setText("")
        }
      }
   
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          sendMessagehandler();
        }
      };
       const sendMessagehandler=async()=>{
          
          try {
            const res = await axios.post(`/post/${selecetedPost?._id}/comment`,{text}, {
              headers:{
                'Content-Type':'application/json'
              },
              withCredentials: true,
            });
            if(res.data.success){
            const updatedCommentdata=[...comment,res.data.comment]
                    setComment(updatedCommentdata)
            
                    const updatedpostdata= posts.map(p=>
                      p._id === selecetedPost._id ? {
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
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="flex p-0 overflow-hidden text-white border border-black rounded-lg outline-none lg:max-w-4xl md:max-w-3xl sm:max-w-xl bg-[#131313]"
      >
        <div className="flex flex-1 gap-2">
          <div className="w-1/2 overflow-hidden">
            <img
              className="object-cover w-full h-full bg-no-repeat rounded-l-lg"
              src={selecetedPost?.image}
              alt="post_image"
            />
          </div>
          <div className="flex flex-col justify-between w-1/2">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Link>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selecetedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold ">{selecetedPost?.author?.username}</Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer"></MoreHorizontal>
                </DialogTrigger>
                <DialogContent  className="flex flex-col items-center text-sm text-center">
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit text-[#ed4956] font-semibold"
                  >
                    Unfollow
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-black cursor-pointer w-fit "
                  >
                    Add to favourites
                  </Button>
                  <Button
                    onClick={() => setOpen(false)}
                    variant="ghost"
                    className="text-black cursor-pointer w-fit "
                  >
                   Cancel
                  </Button>
                </DialogContent >
              </Dialog>
            </div>
            <hr className="" />
            <div className="flex-1 p-4 overflow-y-auto max-h-96 custom-scroll scroll-smooth ">
               {comment.map(comment=><Comment key={comment?._id} comment={comment}></Comment> )}
            </div>
            <div className="p-4">
                <div className="flex items-center gap-2">
                    <input onChange={changeEventHandler}
                    onKeyDown={handleKeyDown}
                    value={text} type="text" placeholder="Add a comment.." className="w-full p-1 text-sm text-white placeholder-gray-400 bg-black rounded-md outline-none sm:text-xs md:text-sm lg:text-base " />
                    <Button disabled={!text.trim()} onClick={sendMessagehandler} variant="outline" className="text-white bg-black border-black ">Send</Button>
                </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
