import React, { useEffect } from 'react'
import axios from "../utils/axios"
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '@/redux/chatSlice'
const useGetAllMessage = () => {
    const {selectedUser}=useSelector(state=>state.auth)
    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchAllMessage=async()=>{
            try {
                const res= await axios.get(`/message/all/${selectedUser?._id}`,{withCredentials:true})
                if(res.data.success){
                 dispatch(setMessages(res.data.message))
                }
            } catch (error) {
                console.log(error)
            } 
        }
        fetchAllMessage()
    },[selectedUser])
}

export default useGetAllMessage