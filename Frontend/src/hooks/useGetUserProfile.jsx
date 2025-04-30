import { setUserProfile } from '@/redux/authSlice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from "../utils/axios"

const useGetUserProfile = (userId) => {
    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchUserProfile=async()=>{
            try {
                const res= await axios.get(`/user/${userId}/profile`,{withCredentials:true})
                if(res.data.success){
                 dispatch(setUserProfile(res.data.user))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserProfile()
    },[userId])
}

export default useGetUserProfile