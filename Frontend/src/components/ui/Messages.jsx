import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Link } from 'react-router-dom'
import { Button } from './button'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({selectedUser}) => {
  useGetAllMessage()
  useGetRTM()
  const {messages}=useSelector(state=>state.chat)
  const {user}=useSelector(state=>state.auth)
  return (
    <div className='flex-1 p-4 overflow-y-auto '>
      <div className='flex justify-center'>
       <div className='flex flex-col items-center justify-between'>
       <Avatar className="w-20 h-20" >
          <AvatarImage src={selectedUser?.profilePicture}></AvatarImage>
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <span>{selectedUser?.username} </span>
        <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2 " variant="secondary">View Profile</Button></Link>
       </div>
      </div>
      <div className='flex flex-col gap-3 text-white'>
        {
         messages && messages?.map((msg)=>{
            return (
              <div className={ `flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start' }`}>
                 <div
        className={`p-2 rounded-2xl max-w-[70%] text-black ${
          msg.senderId === user?._id
            ? 'bg-gray-800 rounded-br-none text-gray-200'
            : 'bg-gray-200 rounded-bl-none'    
        }`}
      >
        {msg.message}
      </div>
              </div>
            )
          })
        }
        
      </div>
    </div>
  )
}

export default Messages