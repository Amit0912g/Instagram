import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from "../utils/axios"
import { setSuggestedUsers } from '@/redux/authSlice'

const useGetSuggestedUser = () => {
    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchSuggestedUser=async()=>{
            try {
                const res= await axios.get("/user/suggested",{withCredentials:true})
                if(res.data.success){
                   
                 dispatch(setSuggestedUsers(res.data.suggestedUser))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSuggestedUser()
    },[])
}

export default useGetSuggestedUser