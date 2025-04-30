import Chatpage from '@/components/ui/Chatpage'
import EditProfile from '@/components/ui/EditProfile'
import Home from '@/components/ui/Home'
import Login from '@/components/ui/Login'
import Mainlayout from '@/components/ui/Mainlayout'
import Notification from '@/components/ui/Notification'
import Profile from '@/components/ui/Profile'
import ProtectedRoutes from '@/components/ui/ProtectedRoutes'
import Signup from '@/components/ui/Signup'
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const appRoutes = () => {
    const routes= createBrowserRouter([
        {
            path:"/",
            element:<ProtectedRoutes><Mainlayout></Mainlayout></ProtectedRoutes>,
            children:[
                {
                    path:"/",
                    element:<ProtectedRoutes><Home></Home></ProtectedRoutes>
                },
                {
                    path:"/profile/:id",
                    element:<ProtectedRoutes><Profile></Profile></ProtectedRoutes>
                },
                {
                    path:"/account/edit",
                    element:<ProtectedRoutes><EditProfile></EditProfile></ProtectedRoutes>
                }
                ,
                {
                    path:"/chat",
                    element:<ProtectedRoutes><Chatpage></Chatpage></ProtectedRoutes>
                },
                {
                    path:"/notification",
                    element:<ProtectedRoutes><Notification></Notification></ProtectedRoutes>
                }

            ]
        },
        {
            path:"/login",
            element:<Login></Login>
        },
        {
            path:"/signup",
            element:<Signup></Signup>  
        }

    ])
  return (
 <RouterProvider router={routes}></RouterProvider>
  )
}

export default appRoutes