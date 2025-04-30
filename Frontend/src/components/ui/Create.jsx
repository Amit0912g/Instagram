import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "../../utils/axios"
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const Create = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading,setLoading]=useState("")
  const {user}=useSelector(state=>state.auth)
  const {posts}=useSelector(state=>state.post)
  const dispatch=useDispatch()
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    console.log(file)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB.");
      return;
    }
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };


  const createPostHandler = async()=>{
    const formData= new FormData()
    formData.append("caption",caption)
    if(imagePreview) formData.append("image",file)
    try {
        setLoading(true)
        const res= await axios.post("http://localhost:8000/api/v1/post/addpost",formData,{

          headers:{
            'Content-Type':'multipart/form-data'
          },
          withCredentials:true
        })
       if(res.data.success){
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setOpen(false)
       }

    } catch (error) {
        toast.error(error.response.data.message)
    }
    finally{
      setLoading(false)
    }
  }
  const resetForm = () => {
    setCaption("");
    setImagePreview(null);
    setFile(null);
  };
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetForm(); // 👈 Reset on close
      }
    }}>
      <DialogContent
        className="bg-[#131313] text-white sm:text-xs md:text-sm lg:text-base text-sm focus-visible:ring-transparent border-none "
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader className="text-center font-semibold ">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="image"></AvatarImage>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="text-gray-400 text-sm">{user?.bio}</span>
          </div>
        </div>
        <Textarea 
        value={caption}
        onChange={(e)=>setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a text"
        ></Textarea>
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img src={imagePreview} alt="preview_img" className="h-full w-full object-cover rounded-sm"/>
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
      {!imagePreview && (
  <Button
    onClick={() => imageRef.current.click()}
    className="w-fit mx-auto bg-[#0095f6] hover:bg-[#82ccfd] hover:text-black"
  >
    Select File
  </Button>
)}
        {
            imagePreview && (
                loading ? (
                    <Button>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                        Please wait..
                    </Button>
                ) :(
                    <Button onClick={createPostHandler} className="w-full " type="submit">
                        Post
                    </Button>
                )
            )
        }
      </DialogContent>
    </Dialog>
  );
};

export default Create;
