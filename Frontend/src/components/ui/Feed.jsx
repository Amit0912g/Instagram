import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex flex-1 flex-col items-center xl:pl-[20%] xl:pr-[5%]  sm:pl-[5%] sm:pr-[2%] md:pl-[10%] md:pr-[3%] lg:pl-[15%] lg:pr-[1%] '>
        <Posts></Posts>
    </div>
  )
}

export default Feed