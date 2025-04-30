import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts}=useSelector(state=>state.post)
  return (
    <div className=''>
        {
          posts.map(post=><Post key={post._id} post={post}></Post>)
        }
    </div>
  )
}

export default Posts