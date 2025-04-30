import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Link } from 'react-router-dom'

const SuggestedUser = () => {
    const {suggestedUsers}=useSelector(state=>state.auth)
  return (
    <div className='my-10'>
        <div className='flex items-center justify-between text-sm'>
            <h1 className='font-semibold text-gray-400'>Suggested For You</h1>
            <span className='font-medium cursor-pointer text-gray-200 ml-5'>View All</span>
        </div>
{suggestedUsers?.map(user=>{
    return (
        <div key={user?._id} className='flex items-center justify-between my-5'>
            <div className="flex items-center gap-2 ">
                    <Link to={`/profile/${user?._id}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="">
                      <h1 className="font-semibold	text-sm"><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                      <span className="text-gray-500 text-sm">
                        {user?.bio }
                      </span>
                    </div>
                  </div>
                  <span className='text-[#3badf8] text-xs font-bold cursor-pointer hover:text-[#285e82]'>Follow</span>
        </div>
    )
})}
    </div>
  )
}

export default SuggestedUser