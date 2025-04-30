import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "../../utils/axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
const EditProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const imageRef = useRef();
  const [loading,setLoading]=useState(false)
  const [input,setInput]=useState({
    profilePicture:user?.profilePicture,
    bio:user?.bio,
    gender:user?.gender
  })
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const fileChangeHandler=(e)=>{
    const file =e.target.files?.[0]
    if(file){
        setInput({...input,profilePicture:file})
    }
  }
  const selectChangeHandler=(value)=>{
setInput({...input,gender:value})
  }
  const editProfileHandler=async()=>{
 
    const formdata= new FormData()
    formdata.append("bio",input.bio)
    formdata.append("gender",input.gender)
    if(input.profilePicture){
        formdata.append("profilePicture",input.profilePicture)
    }
try {
    setLoading(true)
    const res=await axios.post("/user/profile/edit",formdata,{
        headers:{
            "Content-Type":"multipart/form-data"
        },
        withCredentials:true
        
    })
    if(res.data.success){
 
        toast.success(res.data.message)
        const updatedUserdata={
            ...user,
            bio:res.data.user?.bio,
            profilePicture:res.data?.user?.profilePicture,
            gender:res.data.user?.gender,
        }
        dispatch(setAuthUser(updatedUserdata))
        navigate(`/profile/${user?._id}`)
        
    }
} catch (error) {
  
    toast.error(error.response.data.message)
}
finally{
    setLoading(false)
}
  } 
  return (
    <div className="flex mx-auto pl-2 max-w-2xl ">
      <section className=" flex-col flex gap-6 w-full my-8">
        <h1 className="font-bold xl:text-3xl lg:text-2xl md:text-xl sm:text-lg">
          Edit Profile
        </h1>
        <div className="flex items-center justify-between gap-2 bg-[#1d1d1d] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="">
              <h1 className="font-bold	text-sm">{user?.username}</h1>
              <span className="text-gray-500 ">{user?.bio}</span>
            </div>
          </div>
          <input ref={imageRef} type="file" onChange={fileChangeHandler} className="hidden" />
          <Button
            onClick={() => imageRef.current.click()}
            className="bg-[#1e6a9c] hover:bg-[#13285c]"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
          value={input.bio}
          onChange={(e)=>setInput({...input,bio:e.target.value})}
            className="focus-visible:ring-transparent border-gray-800"
            placeholder="Write a text"
          ></Textarea>
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>

          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="border border-gray-800 text-gray-200 focus:ring-0 focus:border-gray-500 w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900  text-gray-200">
              <SelectItem value="male" className="hover:bg-zinc-800">
                Male
              </SelectItem>
              <SelectItem value="female" className="hover:bg-zinc-800">
                Female
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end pr-5">
            { loading ? (
                <Button className="bg-[#1e6a9c]  p-5">
                    <Loader2 className="h-4 w-4 animate-spin mr-2"></Loader2>
                    Please wait..</Button>
            ):(

            <Button onClick={editProfileHandler} className="bg-[#1e6a9c] hover:bg-[#13285c] p-5">Submit</Button>
            )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
