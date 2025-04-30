import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode } from "lucide-react";
import { Button } from "./button";
import Messages from "./Messages";
import axios from "../../utils/axios";
import { setMessages } from "@/redux/chatSlice";

const Chatpage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (state) => state.auth
  );
  const [textMessage,setTextMessage]=useState("")
  const {onlineUsers,messages}=useSelector(state=>state.chat)
  const dispatch = useDispatch();
  const sendMessageHandler=async(receiverId)=>{
    try {
      const res= await axios.post(`/message/send/${receiverId}`,{textMessage},{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      })
      if(res.data.success){
        dispatch(setMessages([...messages,res.data.newMessage]))
        setTextMessage("")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler(selectedUser?._id)
    }
  };
  useEffect(()=>{
    return ()=>{
      dispatch(setSelectedUser(null))
    }
  },[])
return (
   
<div className="flex h-screen overflow-hidden ">


<section className="flex flex-col xl:w-[300px] lg:w-[250px] md:w-[180px]">
  

  <div className="flex items-center py-4 pl-4 pr-2 md:gap-5 sm:gap-2">
    <Avatar>
      <AvatarImage src={user?.profilePicture} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <h1 className="font-bold md:text-xl sm:text-lg">{user?.username}</h1>
  </div>

  <hr className="border-gray-500" />

  <div className="flex-1 overflow-y-auto custom-scroll">
    {suggestedUsers?.map((suggestedUser) => {
      const isOnline=onlineUsers.includes(suggestedUser?._id)
      return (
        <div
        key={suggestedUser?._id}
        onClick={() => dispatch(setSelectedUser(suggestedUser))}
        className="flex items-center gap-3 p-4 rounded-sm hover:bg-[#313131] hover:text-gray-300 cursor-pointer"
      >
        <Avatar className="w-12 h-12">
          <AvatarImage src={suggestedUser?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{suggestedUser?.username}</span>
          <span className={`text-xs font-medium ${isOnline ? "text-green-600" : "text-red-600"}`}>
          {`${isOnline ? "Online" : "Offline"}`}
          </span>
        </div>
      </div>
      )
})}
  </div>
</section>

<section className="flex flex-col flex-1 border-l border-l-gray-500">

  {selectedUser ? (
    <>
      <div className="sticky top-0 z-10 flex items-center gap-3 px-3 py-4 border-b border-gray-500">
        <Avatar>
          <AvatarImage src={selectedUser?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{selectedUser?.username}</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scroll">
        <Messages selectedUser={selectedUser} />
      </div>

      <div className="p-4 border-t border-t-gray-500">
        <div className="flex items-center gap-2">
          <input
          value={textMessage}
          onChange={(e)=>setTextMessage(e.target.value)}
          onKeyDown={handleKeyDown}
            type="text"
            placeholder="Type"
            className="flex-1 p-3 text-base text-white placeholder-gray-400 bg-[#212121] rounded-md outline-none"
          />
          <Button onClick={()=>sendMessageHandler(selectedUser?._id)} variant="outline" className="py-2 text-white bg-black border-black">
            Send
          </Button>
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center justify-center w-full h-full mx-auto text-center ">
      <MessageCircleCode className="w-32 h-32 my-5" />
      <h1 className="text-xl font-medium">Your Messages</h1>
      <span>Send a message to start a chat...</span>
    </div>
  )}
</section>

</div>

)

};

export default Chatpage;
