import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import useMediaQuery from '@/utils/useMediaQuery';

const Mainlayout = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 760px)"); 
  const isChatPage = location.pathname.startsWith("/chat");

  const shouldHideSidebar = isChatPage && isSmallScreen;
  return (
    <div className='flex min-h-[100dvh] sm:h-screen' >
     {!shouldHideSidebar && (
        <div>
          <LeftSidebar />
        </div>
      )}
     <div className={`flex-1 min-w-0  overflow-y-scroll custom-scroll scroll-smooth ${!shouldHideSidebar ? 'lg:ml-[300px] sm:ml-[230px] ml-5' : ''}`}>
    <Outlet></Outlet> 
    </div>
</div>
  )
}

export default Mainlayout